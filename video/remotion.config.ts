import { Config } from "@remotion/cli/config";

// Rendu avec le Chrome installé : pas de navigateur téléchargé.
Config.setBrowserExecutable("C:/Program Files/Google/Chrome/Application/chrome.exe");
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setConcurrency(4);
