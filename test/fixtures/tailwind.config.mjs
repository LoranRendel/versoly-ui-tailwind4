import versolyUI from "@loranrendel/versoly-ui/plugin";

export default {
  plugins: [versolyUI({ include: ["button", "card"], exclude: ["card"], prefix: "js-" })],
};
