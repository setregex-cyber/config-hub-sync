import { useTheme } from "next-themes";
import logo from "@/assets/logo.svg";

export const Logo = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  
  return (
    <img 
      src={logo} 
      alt="setregex logo" 
      className="h-16 w-auto"
      style={{
        filter: currentTheme === 'dark' 
          ? 'brightness(0) invert(1)' 
          : 'brightness(0)'
      }}
    />
  );
};
