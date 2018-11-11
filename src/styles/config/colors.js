// @flow
import { transparentize } from 'polished';

const white = '#FFFFFF';
const light = '#d2deff';
const lightMid = transparentize(0.5, light);
const lightFaint = transparentize(0.7, light);
const lightFaintest = transparentize(0.9, light);
const blackBlue = '#0b111f';
const darkBlue = '#141E34';
const mediumBlue = '#152036';
const siteBackground = darkBlue;
const darkInput = transparentize(0.65, '#000626');
const darkInputFocused = transparentize(0.45, '#000626');

export default {
  white,
  light,
  lightMid,
  lightFaint,
  lightFaintest,
  blackBlue,
  darkBlue,
  mediumBlue,
  siteBackground,
  darkInput,
  darkInputFocused,
};
