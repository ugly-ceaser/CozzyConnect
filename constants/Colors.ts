const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const RED_COLOR = "#FF0303"
export const WHITE_COLOR = "#FFF"
export const ORANGE_COLOR = "#EEA339"
export const PRIMARY_COLOR = "#424F24"
export const GRAY_COLOR = "#aaa"
export const SUCCESS_COLOR = "#1eb21e"
export const DARK_COLOR = "#7D7979"
export const BLACK_COLOR = "#000"
export const BG_DARK_MAIN = "#1e1e1e"
export const BG_DARK_SEC = "#242424"
export const OFF_GREEN = "#E2E1C2"
export const DISABLE_GRAY = "#D9D9D9"
export const BLUE_COLOR = "rgba(0, 122, 255, 1)"
export const INFO_GRAY_COLOR = "#999"

export default {
  light: {
    text: '#1A1A1A',
    background: WHITE_COLOR,
    borderColor: PRIMARY_COLOR,
    tint: tintColorLight,
    red: RED_COLOR,
    orange: ORANGE_COLOR,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: BG_DARK_MAIN,
    borderColor: '#ECEDE9',
    red: RED_COLOR,
    orange: ORANGE_COLOR,
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
