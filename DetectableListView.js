var React = require('react-native');
var {
  ListView
} = React;

var ObjectAssign = require("object-assign");

const DETECT_INTERVAL = 300;

var DetectableListView = React.createClass({

  componentWillMount: function() {
    this._offset = {
      x : 0,
      y : 0
    };
    this._isDetecting = false;
  },

  _onScroll : function(e) {

    ObjectAssign(this._offset, e.nativeEvent.contentOffset);
    if(!this._isDetecting) {
      this._detectIsScrolling();
    }

    this.props.onScroll && this.props.onScroll(e);
  },

  _detectIsScrolling : function() {
    this._isDetecting = true;
    var originOffset = {};
    ObjectAssign(originOffset, this._offset);
    setTimeout(function() {
      if(originOffset.y == this._offset.y && originOffset.x == this._offset.x) {
        this._isDetecting = false;
        var tmpOffset = {};
        ObjectAssign(tmpOffset, this._offset);
        this.props.onScrollStop && this.props.onScrollStop(tmpOffset);
      }
      else {
        this._detectIsScrolling();
      }
    }.bind(this), DETECT_INTERVAL);
  },

  componentDidMount: function() {
    this._detectIsScrolling();
  },

  getListView : function() {
    return this.refs.listView;
  },

  render : function() {
    var props = {};
    ObjectAssign(props, this.props);
    delete props.onScroll;
    return <ListView {...props} onScroll={this._onScroll} ref={"listView"}  />
  }
});

module.exports = DetectableListView;
