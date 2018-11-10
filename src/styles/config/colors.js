// @flow
import { transparentize } from 'polished';

const white = '#FFFFFF';
const light = '#d2deff';
const lightMid = transparentize(0.5, light);
const lightFaint = transparentize(0.7, light);
const darkBlue = '#141E34';
const mediumBlue = '#152036';
const siteBackground = darkBlue;

export default {
  white,
  light,
  lightMid,
  lightFaint,
  darkBlue,
  mediumBlue,
  siteBackground,
};
