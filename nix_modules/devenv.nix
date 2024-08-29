{inputs, ...}: {
  imports = [
    inputs.devenv.flakeModule
  ];
  perSystem = {pkgs, ...}: {
    devenv.shells.default = {
      enterShell = ''
        printf "Welcome to PLATNM\n" | ${pkgs.lolcat}/bin/lolcat
        printf "\033[0;1;36mDEVSHELL ACTIVATED\033[0m\n"
        help-msg
      '';

      languages = {
        go.enable = true;
        javascript.enable = true;
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
        "help-msg".exec = ''
          ${pkgs.go-task}/bin/task --list-all
        '';
      };
    };
  };
}
