{inputs, ...}: {
  imports = [
    inputs.devenv.flakeModule
  ];
  perSystem = {pkgs, ...}: {
    devenv = {
      modules = [
        inputs.env-help.devenvModule
      ];
      shells.default = {
        enterShell = ''
          printf "Welcome to PLATNM\n" | ${pkgs.lolcat}/bin/lolcat
          printf "\033[0;1;36mDEVSHELL ACTIVATED\033[0m\n"
          env-help
        '';

        env-help.enable = true;
        languages = {
          go.enable = true;
          javascript = {
            enable = true;
            npm.enable = true;
          };
          nix.enable = true;
          typescript.enable = true;
        };

        packages = with pkgs; [
          nodePackages.eslint
          nodePackages.prettier
          supabase-cli
        ];

        scripts = {
          "backend-lint" = {
            description = "Lints backend code.";
            exec = ''
              cd "$DEVENV_ROOT"/backend
              ${pkgs.gum}/bin/gum spin --spinner dot --title "go mod tidy" -- go mod tidy
              ${pkgs.gum}/bin/gum spin --spinner dot --title "go fmt" -- go fmt ./...
              ${pkgs.gum}/bin/gum spin --spinner dot --title "go vet" -- go vet ./...
              ${pkgs.gum}/bin/gum spin --spinner dot --title "golangci-lint" -- ${pkgs.golangci-lint}/bin/golangci-lint run ./...
            '';
          };
          "backend-run" = {
            description = "Runs the backend server in development mode.";
            exec = ''
              cd "$DEVENV_ROOT"/backend
              ${pkgs.gum}/bin/gum spin --spinner dot --title "go mod tidy" -- go mod tidy
              ${pkgs.rubyPackages.dotenv}/bin/dotenv -i -f ""$DEVENV_ROOT"/.env" -- \
              ${pkgs.watchexec}/bin/watchexec -r -e go -- \
              go run cmd/server/main.go
            '';
          };
          "backend-test" = {
            description = "Tests backend code.";
            exec = ''
              cd "$DEVENV_ROOT"/backend
              ${pkgs.gum}/bin/gum spin --spinner dot --title "go test" -- go test ./...
            '';
          };
          "frontend-lint" = {
            description = "Lints frontend code.";
            exec = ''
              cd "$DEVENV_ROOT"/frontend
              echo "TODO"
            '';
          };
          "frontend-run" = {
            description = "Runs the frontend server in development mode.";
            exec = ''
              cd "$DEVENV_ROOT"/frontend
              echo "TODO"
            '';
          };
        };
      };
    };
  };
}
