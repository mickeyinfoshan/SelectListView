var React = require('react-native');
var PropTypes = React.PropTypes;

var {
  View
} = React;

var DetectableListView = require("./DetectableListView");

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var ObjectAssign = require("object-assign");

var SelectListView = React.createClass({

  propTypes : {
    itemHeight : PropTypes.number,
    defaultItemIndex : PropTypes.number
  },

  _selectItem : function(offset) {
    var offsetY = offset.y;
    var containerHeight = this.props.style.height || height;
    var itemHeight = this.props.itemHeight;
    var innerOffset = (containerHeight - itemHeight) / 2;
    var selectedRowIndex = Math.round((offsetY + innerOffset) / this.props.itemHeight);
    offsetY = selectedRowIndex * this.props.itemHeight - innerOffset;
    this.refs._component.getListView().getScrollResponder().scrollTo(offsetY);
    this.props.onSelect && this.props.onSelect(selectedRowIndex);
  },

  renderRow : function(rowData, sectionID, rowID, highlightRow) {

    var row = {
      rowData : rowData,
      sectionID : sectionID,
      rowID : rowID
    };

    return this.props.renderRow(rowData, sectionID, rowID, highlightRow);

  },

  componentDidMount: function() {
    if(!this.props.defaultItemIndex) {
      return;
    }
    setTimeout(function() {
      var containerHeight = this.props.style.height || height;
      var itemHeight = this.props.itemHeight;
      var innerOffset = (containerHeight - itemHeight) / 2;
      var offsetY = this.props.defaultItemIndex * this.props.itemHeight - innerOffset;
      this.refs._component.getListView().getScrollResponder().scrollTo(offsetY);
      this.props.onSelect && this.props.onSelect(this.props.defaultItemIndex);
    }.bind(this), 200);
  },


  render: function() {
    var props = {};
    ObjectAssign(props, this.props);
    delete props.renderRow;
    var containerHeight = this.props.style.height || height;
    return (
      <View style={[this.props.style]}>
        <DetectableListView {...props} onScrollStop={this._selectItem} ref={"_component"} renderRow={this.renderRow} />
        <View style={{
            height : this.props.itemHeight,
            position : "absolute",
            left : 0,
            top : (containerHeight - this.props.itemHeight) / 2,
            borderTopWidth : 1,
            borderBottomWidth : 1,
            width : this.props.style.width || width,
            borderColor : "#ccc"
          }}
          >

        </View>
      </View>
  );
  }

});

module.exports = SelectListView;
