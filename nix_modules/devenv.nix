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
          list-tasks
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
          go-task
          golangci-lint
          nodePackages.eslint
          nodePackages.prettier
          supabase-cli
          watchexec
        ];

        scripts = {
          "list-tasks".exec = ''
            ${pkgs.go-task}/bin/task --list-all
          '';
        };
      };
    };
  };
}
