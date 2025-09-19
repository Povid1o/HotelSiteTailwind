"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _enzymeToJson = _interopRequireDefault(require("enzyme-to-json"));

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

it('renders a simple Youtube Video', () => {
  const wrapper = (0, _enzyme.shallow)(_react.default.createElement(_index.default, {
    type: "youtube",
    videoId: "CDFN1VatiJA"
  }));
  expect((0, _enzymeToJson.default)(wrapper)).toMatchSnapshot();
});
it('renders a simple Vimeo Video', () => {
  const wrapper = (0, _enzyme.shallow)(_react.default.createElement(_index.default, {
    type: "vimeo",
    videoId: "https://vimeo.com/189789787"
  }));
  expect((0, _enzymeToJson.default)(wrapper)).toMatchSnapshot();
});
it('renders a simple HTML5 Video with Captions', () => {
  const wrapper = (0, _enzyme.shallow)(_react.default.createElement(_index.default, {
    type: "video",
    poster: "/path/to/poster.jpg",
    url: "mymovie.mp4",
    tracks: [{
      kind: 'captions',
      label: 'English captions',
      src: '/path/to/english-captions.vtt',
      srclang: 'en',
      default: true
    }, {
      label: 'Spanish captions',
      src: '/path/to/spanish-captions.vtt',
      srclang: 'es'
    }]
  }));
  expect((0, _enzymeToJson.default)(wrapper, {
    noKey: true,
    mode: 'deep'
  })).toMatchSnapshot();
});