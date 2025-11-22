# 📱 Local LLM App (Experimental)

Run large language models directly on your mobile device with zero internet connectivity required. This application demonstrates on-device AI inference for iOS and Android, enabling private, offline conversations powered by local LLM execution.

<img width="1908" height="1648" alt="Screenshot 2025-11-22 at 9 22 48 PM" src="https://github.com/user-attachments/assets/9fa92c0b-8f65-4a13-923c-b6a97ce7645b" />


## ✨ Features

- 🔓 **Fully Offline Inference** – Execute LLM inference directly on device without any API calls or network dependency
- 🚀 **Cross-Platform** – Built with React Native for seamless iOS and Android support
- 🔒 **Privacy First** – All conversations and model data remain completely local to your device
- ⚡ **No External Dependencies** – Zero reliance on cloud services or APIs for model inference
- ⚙️ **Optimized Performance** – Efficient model loading and inference tailored for mobile constraints

## 🏗️ Architecture

The app leverages on-device machine learning capabilities to run LLM inference directly on the device's processor. Unlike typical AI mobile apps that require API calls to remote servers, this implementation loads and executes models entirely locally, ensuring complete privacy and offline functionality.

### 🛠️ Tech Stack

- **Framework:** React Native
- **Runtime:** Native device capabilities for ML inference
- **Language:** JavaScript/TypeScript
- **Platforms:** iOS, Android

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js and npm/yarn
- React Native development environment set up
- Xcode (for iOS development)
- Android Studio (for Android development)

### 📥 Installation

1. Clone the repository:
```bash
git clone https://github.com/eddywm/local-llm-app.git
cd local-llm-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install iOS pods (if developing for iOS):
```bash
cd ios && pod install && cd ..
```

### ▶️ Running the App

**iOS:**
```bash
npm run ios
# or
react-native run-ios
```

**Android:**
```bash
npm run android
# or
react-native run-android
```

## 🧠 How It Works

The app loads language models optimized for mobile inference and executes them on-device using native capabilities. When you send a message:

1. Input is processed and formatted for the local model
2. Inference runs directly on the device's CPU/GPU
3. Response is generated and displayed in the chat interface
4. No data leaves your device at any point


## About This Project

This is a **proof of concept** application designed for demonstration and educational purposes. It showcases the feasibility of running LLMs directly on mobile devices. The implementation is inspired by resources and best practices from the [Hugging Face](https://huggingface.co/) community.
