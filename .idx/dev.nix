# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [ 
    pkgs.nodejs_20 
    # iOS development tools
    pkgs.cocoapods
    pkgs.ruby
    pkgs.xcbeautify
    # Additional development tools
    pkgs.watchman
    pkgs.fastlane
  ];
  # Sets environment variables in the workspace
  env = { 
    EXPO_USE_FAST_RESOLVER = 1;
    # iOS-specific environment variables
    IOS_SIMULATOR_DEVICE = "iPhone 15";
    IOS_SIMULATOR_OS = "17.0";
    # React Native iOS configuration
    RCT_NEW_ARCH_ENABLED = "1";
    # Enable iOS development features
    ENABLE_IOS_DEVELOPMENT = "1";
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "msjsdiag.vscode-react-native"
      # iOS development extensions
      "ms-vscode.vscode-swift"
      "ms-vscode.vscode-ios-debug"
      "expo.vscode-expo-tools"
    ];
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        install =
          "npm ci --prefer-offline --no-audit --no-progress --timing && npm i @expo/ngrok@^4.1.0";
      };
      # Runs when a workspace restarted
      onStart = {
        android = ''
          echo -e "\033[1;33mWaiting for Android emulator to be ready...\033[0m"
          # Wait for the device connection command to finish
          adb -s emulator-5554 wait-for-device && \
          npm run android -- --tunnel
        '';
        ios = ''
          echo -e "\033[1;33mSetting up iOS development environment...\033[0m"
          # Check if we're on macOS (required for iOS development)
          if [[ "$OSTYPE" == "darwin"* ]]; then
            echo -e "\033[1;32m✓ macOS detected - iOS development available\033[0m"
            # Install iOS dependencies if needed
            if [ -d "ios" ]; then
              echo "Installing iOS dependencies..."
              cd ios && pod install && cd ..
            fi
            # Start iOS simulator and run app
            echo "Starting iOS development..."
            npm run ios -- --tunnel
          else
            echo -e "\033[1;31m⚠ iOS development requires macOS. Using web preview instead.\033[0m"
            echo "Starting web development..."
            npm run web
          fi
        '';
      };
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "npm" "run" "web" "--" "--port" "$PORT" ];
          manager = "web";
        };
        android = {
          # noop
          command = [ "tail" "-f" "/dev/null" ];
          manager = "web";
        };
        ios = {
          command = [ "npm" "run" "ios" "--" "--port" "$PORT" ];
          manager = "web";
        };
      };
    };
  };
}
