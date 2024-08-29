{
  # description = "Description for the project";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    devshell = {
      url = "github:numtide/devshell";
      inputs = {
        nixpkgs.follows = "nixpkgs";
      };
    };
    flake-parts = {
      url = "github:hercules-ci/flake-parts";
      inputs = {
        nixpkgs-lib.follows = "nixpkgs";
      };
    };
  };

  outputs = inputs @ {
    flake-parts,
    devshell,
    ...
  }:
    flake-parts.lib.mkFlake {inherit inputs;} {
      imports = [
        devshell.flakeModule
      ];
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
        "x86_64-darwin"
      ];
      perSystem = {pkgs, ...}: {
        devshells.default = {
          env = [
            {
              name = "PRISMA_QUERY_ENGINE_BINARY";
              value = "${pkgs.prisma-engines}/bin/query-engine";
            }
            {
              name = "PRISMA_SCHEMA_ENGINE_BINARY";
              value = "${pkgs.prisma-engines}/bin/schema-engine";
            }
            {
              name = "PRISMA_QUERY_ENGINE_LIBRARY";
              value = "${pkgs.prisma-engines}/lib/libquery_engine.node";
            }
            {
              name = "PRISMA_FNT_BINARY";
              value = "${pkgs.prisma-engines}/bin/prisma-fmt";
            }
          ];
          packages = [
          ];
        };
      };
    };
}
