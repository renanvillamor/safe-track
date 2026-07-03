import { Image } from "react-native";

interface LogoProps {
  size?: number;
}

export function Logo({ size = 96 }: LogoProps) {
  return (
    <Image
      source={require("../../assets/images/logo.png")}
      style={{ width: size, height: size, borderRadius: size / 4 }}
      resizeMode="contain"
    />
  );
}
