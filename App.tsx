import React from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import { useState } from 'react';
import ScrollView = Animated.ScrollView;
import RNFS from 'react-native-fs';
import { downloadModel } from './api/model.download.ts';
import ProgressBar from './components/ProgressBar.tsx';
import { initLlama, releaseAllLlama } from 'llama.rn';
import ItemPicker, { PickerItem } from './components/ItemPicker.tsx';
import axios from 'axios';
import {
  DEFAULT_GUFF,
  HF_TO_GGUF,
  INITIAL_CONVERSATION,
  Message,
} from './utils/constants.ts';

function App(): React.JSX.Element {
  const [conversation, setConversation] =
    useState<Message[]>(INITIAL_CONVERSATION);
  const [selectedModelFormat, setSelectedModelFormat] = useState<string>('');
  const [selectedGGUF, setSelectedGGUF] = useState<string | null>(null);
  const [availableGGUFs, setAvailableGGUFs] = useState<PickerItem[]>([]);

  const [userInput, setUserInput] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [context, setContext] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const fetchAvailableGGUFs = async (modelFormat: string) => {
    if (!modelFormat) {
      Alert.alert('Error', 'Please select a model format first.');
      return;
    }

    try {
      const repoPath = HF_TO_GGUF[modelFormat as keyof typeof HF_TO_GGUF];
      if (!repoPath) {
        throw new Error(
          `No repository mapping found for model format: ${modelFormat}`,
        );
      }

      const response = await axios.get(
        `https://huggingface.co/api/models/${repoPath}`,
      );

      if (!response.data?.siblings) {
        throw new Error('Invalid API response format');
      }

      const files = response.data.siblings.filter(
        (file: { rfilename: string }) => file.rfilename.endsWith('.gguf'),
      );

      let items: PickerItem[] = files.map(function (file: {
        rfilename: string;
      }) {
        return {
          label: file.rfilename,
          value: file.rfilename,
        };
      });
      setAvailableGGUFs(items);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch .gguf files';
      Alert.alert('Error', errorMessage);
      setAvailableGGUFs([]);
    }
  };

  const handleDownloadModel = async (file: string) => {
    const downloadUrl = `https://huggingface.co/${
      HF_TO_GGUF[selectedModelFormat as keyof typeof HF_TO_GGUF]
    }/resolve/main/${file}`;

    setIsDownloading(true);
    setProgress(0);

    try {
      const destPath = await downloadModel(file, downloadUrl, progress_ =>
        setProgress(progress_),
      );

      if (destPath) {
        await loadModel(file);
      }

      console.log('destPath', destPath);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Download failed due to an unknown error.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  const loadModel = async (modelName: string) => {
    try {
      const destPath = `${RNFS.DocumentDirectoryPath}/${modelName}`;

      const fileExists = await RNFS.exists(destPath);
      if (!fileExists) {
        Alert.alert('Error Loading Model', 'The model file does not exist.');
        return false;
      }

      if (context) {
        await releaseAllLlama();
        setContext(null);
        setConversation(INITIAL_CONVERSATION);
      }

      const llamaContext = await initLlama({
        model: destPath,
        use_mlock: true,
        n_ctx: 2048,
        n_gpu_layers: 1,
      });

      console.log('llamaContext', llamaContext);
      setContext(llamaContext);

      return true;
    } catch (error) {
      Alert.alert(
        'Error Loading Model',
        error instanceof Error ? error.message : 'An unknown error occurred.',
      );
      return false;
    }
  };

  const handleSendMessage = async () => {
    if (!context) {
      Alert.alert('Model Not Loaded', 'Please load the model first.');
      return;
    }

    if (isGenerating) {
      return;
    }

    if (!userInput.trim()) {
      Alert.alert('Input Error', 'Please enter a message.');
      return;
    }

    const newConversation: Message[] = [
      ...conversation,
      { role: 'user', content: userInput },
    ];

    setIsGenerating(true);
    setConversation(newConversation);

    setUserInput('');

    try {
      const stopWords = [
        '</s>',
        '<|end|>',
        'user:',
        'assistant:',
        '<|im_end|>',
        '<|eot_id|>',
        '<|end▁of▁sentence|>',
        '<｜end▁of▁sentence｜>',
      ];

      console.log({ context });

      const result = await context?.completion({
        messages: newConversation,
        n_predict: 10000,
        stop: stopWords,
      });

      if (result && result.text) {
        setConversation(prev => [
          ...prev,
          { role: 'assistant', content: result.text.trim() },
        ]);
      } else {
        throw new Error('No response from the model.');
      }
    } catch (error) {
      Alert.alert(
        'Error During Inference',
        error instanceof Error ? error.message : 'An unknown error occurred.',
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
        }}
      >
        <ScrollView>
          <View style={{ marginTop: 15, marginBottom: 15 }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              {Object.keys(HF_TO_GGUF).map(format => (
                <TouchableOpacity
                  key={format}
                  onPress={() => {
                    setSelectedModelFormat(format);
                    setAvailableGGUFs([]);
                    fetchAvailableGGUFs(format);
                  }}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 18,
                    backgroundColor:
                      selectedModelFormat === format ? '#007AFF' : '#F5F5F5',
                    borderWidth: 1,
                    borderColor:
                      selectedModelFormat === format ? '#007AFF' : '#E8E8E8',
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '500',
                      color: selectedModelFormat === format ? '#fff' : '#666',
                    }}
                  >
                    {format}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <ItemPicker
            items={availableGGUFs}
            selectedValue={selectedGGUF}
            onValueChange={newValue => {
              setSelectedGGUF(newValue as string);
            }}
            label=""
            placeholder="Select a model..."
          />

          <TouchableOpacity
            onPress={() => handleDownloadModel(selectedGGUF || DEFAULT_GUFF)}
            disabled={!selectedModelFormat}
            style={{
              backgroundColor: selectedModelFormat ? '#007AFF' : '#CCCCCC',
              paddingHorizontal: 24,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: selectedModelFormat ? '#007AFF' : 'transparent',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: selectedModelFormat ? 0.3 : 0,
              shadowRadius: 8,
              elevation: selectedModelFormat ? 6 : 0,
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: 'white',
              }}
            >
              {selectedModelFormat ? 'Download Model' : 'Select Format First'}
            </Text>
          </TouchableOpacity>

          {isDownloading && <ProgressBar progress={progress} />}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 12,
              marginHorizontal: 12,
              gap: 10,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                borderWidth: 1.5,
                borderColor: '#E0E0E0',
                borderRadius: 24,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: '#333',
                backgroundColor: '#F8F8F8',
              }}
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Type your message here..."
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              onPress={handleSendMessage}
              style={{
                backgroundColor: '#007AFF',
                borderRadius: 24,
                paddingHorizontal: 20,
                paddingVertical: 12,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#007AFF',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Send
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: '#fff',
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
            showsVerticalScrollIndicator={false}
          >
            {conversation.slice(1).map((msg, index) => (
              <View key={index} style={styles.messageWrapper}>
                <View
                  style={[
                    styles.messageBubble,
                    msg.role === 'user'
                      ? styles.userBubble
                      : styles.llamaBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      msg.role === 'user' && styles.userMessageText,
                    ]}
                  >
                    {msg.content}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messageWrapper: {
    marginBottom: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B82F6',
  },
  messageText: {
    fontSize: 16,
    color: '#334155',
  },
  llamaBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
});

export default App;
