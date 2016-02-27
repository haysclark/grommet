// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';

const CLASS_ROOT = 'columns';

export default class Columns extends Component {

  constructor (props) {
    super(props);
    this._onResize = this._onResize.bind(this);
    this._layout = this._layout.bind(this);
    this.state = { count: 1 };
  }

  componentDidMount () {
    window.addEventListener('resize', this._onResize);
    this._layout();
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this._onResize);
    clearTimeout(this._layoutTimer);
  }

  _onResize () {
    clearTimeout(this._layoutTimer);
    this._layoutTimer = setTimeout(this._layout, 50);
  }

  _layout () {
    const container = this.refs.container;
    let count = 1;
    const child = container.childNodes[0];
    if (child) {
      const rect = container.getBoundingClientRect();
      const childRect = child.getBoundingClientRect();
      count = Math.floor(rect.width / childRect.width);
    }
    this.setState({ count: count });
  }

  render() {
    let classes = [CLASS_ROOT];
    if (this.props.size) {
      classes.push(`${CLASS_ROOT}--${this.props.size}`);
    }
    if (this.props.className) {
      classes.push(this.props.className);
    }

    const children = React.Children.toArray(this.props.children);
    const childrenPerColumn = Math.floor(children.length / this.state.count);
    let groups = [];
    let offset = 0;
    while (groups.length < this.state.count) {
      groups.push(children.slice(offset, offset + childrenPerColumn));
      offset += childrenPerColumn;
    }

    const columns = groups.map((group, index) => (
      <div key={index} className={`${CLASS_ROOT}__column`}>
        {group}
      </div>
    ));

    return (
      <div ref="container" className={classes.join(' ')}>
        {columns}
      </div>
    );
  }
}

Columns.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};
