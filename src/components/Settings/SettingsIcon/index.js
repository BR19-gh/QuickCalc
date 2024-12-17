import { LinearGradient } from "expo-linear-gradient";
import SweetSFSymbol from "sweet-sfsymbols";

const SettingsIcon = ({ bgColor, name, theme }) => {
  console.log("theme: ", theme);
  return (
    <LinearGradient
      colors={theme === "dark" ? ["#313131", "#141414"] : [bgColor, bgColor]}
      style={{
        alignItems: "center",
        padding: 6,
        width: 30,
        height: 30,
        borderRadius: 5,
        borderColor: theme === "dark" ? "#626262" : "white",
        borderWidth: 0.5,
      }}
    >
      <SweetSFSymbol
        name={name}
        size={17}
        colors={[theme === "dark" ? bgColor : "white"]}
      />
    </LinearGradient>
  );
};

export default SettingsIcon;
