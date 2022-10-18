/* eslint-disable */

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { Component, HTMLAttributes, createContext } from 'react'
import classNames from 'classnames'

import { EuiIcon, EuiI18n, EuiText, EuiInnerText, htmlIdGenerator } from '@elastic/eui'

import { CommonProps } from '@elastic/eui/src/components/common'

const EuiTreeViewContext = createContext<string>('')

function hasAriaLabel (
  x: HTMLAttributes<HTMLUListElement>
): x is { 'aria-label': string } {
  return x.hasOwnProperty('aria-label')
}

function getTreeId (
  propId: string | undefined,
  contextId: string,
  idGenerator: Function
) {
  return propId ?? (contextId === '' ? idGenerator() : contextId)
}

export interface Node {
  /** An array of EuiTreeViewNodes to render as children
   */
  children?: Node[]
  /** The readable label for the item
   */
  label: React.ReactNode
  /** A unique ID
   */
  id: string
  /** An icon to use on the left of the label
   */
  icon?: React.ReactElement
  /** Display a different icon when the item is expanded.
  For instance, an open folder or a down arrow
  */
  iconWhenExpanded?: React.ReactElement
  /** Use an empty icon to keep items without an icon
  lined up with their siblings
  */
  useEmptyIcon?: boolean
  /** Whether or not the item is expanded.
   */
  isExpanded?: boolean
  /** Optional class to throw on the node
   */
  className?: string
  /** Function to call when the item is clicked.
   The open state of the item will always be toggled.
   */
  callback?: () => string
}

export type EuiTreeViewDisplayOptions = 'default' | 'compressed'

const displayToClassNameMap: {
  [option in EuiTreeViewDisplayOptions]: string | null;
} = {
  default: null,
  compressed: 'euiTreeView--compressed'
}

interface EuiTreeViewState {
  treeID: string
  expandChildNodes: boolean
}

export type CommonTreeProps = CommonProps &
HTMLAttributes<HTMLUListElement> & {
  /**
     * Never accepts children directly, only through the `items` prop
     */
  children?: never
  /** An array of EuiTreeViewNodes
     */
  items: Node[]
  /** Optionally use a variation with smaller text and icon sizes
     */
  display?: EuiTreeViewDisplayOptions
  /** Set all items to open on initial load
     */
  expandByDefault?: boolean
  /** Display expansion arrows next to all items
     * that contain children
     */
  showExpansionArrows?: boolean
}

export type EuiTreeViewProps = Omit<
CommonTreeProps,
'aria-label' | 'aria-labelledby'
> & {
  openItems: string[]
  activeItem: string
}

export class EuiTreeView extends Component<EuiTreeViewProps, EuiTreeViewState> {
  treeIdGenerator = htmlIdGenerator('euiTreeView')
  static contextType = EuiTreeViewContext
  isNested: boolean = !!this.context
  state: EuiTreeViewState = {
    treeID: getTreeId(this.props.id, this.context, this.treeIdGenerator),
    expandChildNodes: this.props.expandByDefault || false
  }

  componentDidUpdate (prevProps: EuiTreeViewProps) {
    if (this.props.id !== prevProps.id) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        treeID: getTreeId(this.props.id, this.context, this.treeIdGenerator)
      })
    }
  }

  buttonRef: Array<HTMLButtonElement | undefined> = []

  setButtonRef = (
    ref: HTMLButtonElement | HTMLAnchorElement | null,
    index: number
  ) => {
    this.buttonRef[index] = ref as HTMLButtonElement
  }

  handleNodeClick = (node: Node, ignoreCallback: boolean = false) => {
    // const index = this.state.openItems.indexOf(node.id);

    this.setState({
      expandChildNodes: false
    })

    node.isExpanded = !node.isExpanded

    if (!ignoreCallback && node.callback !== undefined) {
      node.callback()
    }
    /*
    if (this.isNodeOpen(node)) {
      // if the node is part of openItems[] then remove it
      this.setState({
        openItems: this.state.openItems.filter((_, i) => i !== index),
      });
    } else {
      // if the node isn't part of openItems[] then add it
      this.setState((prevState) => ({
        openItems: [...prevState.openItems, node.id],
        activeItem: node.id,
      }));
    } */
  }

  // check if the node is included in openItems[]
  isNodeOpen = (node: Node) => {
    return this.props.openItems.includes(node.id)
  }

  renderBranch (items: Node[]) {
    const {
      children,
      className,
      display = 'default',
      expandByDefault,
      showExpansionArrows,
      activeItem,
      openItems,
      ...rest
    } = this.props

    // Computed classNames
    const classes = classNames(
      'euiTreeView',
      display ? displayToClassNameMap[display] : null,
      { 'euiTreeView--withArrows': showExpansionArrows },
      className
    )

    return (
    <ul
    className={classes}
    id={!this.isNested ? this.state.treeID : undefined}
    {...rest}
    >
    {items.map((node, index) => {
      const buttonId = node.id
      const wrappingId = this.treeIdGenerator(buttonId)

      return (
        <EuiInnerText
            key={node.id + index}
            fallback={typeof node.label === 'string' ? node.label : ''}
        >
            {(ref, innerText) => (
            <EuiI18n
                key={node.id + index}
                token="euiTreeView.ariaLabel"
                default="{nodeLabel} child of {ariaLabel}"
                values={{
                  nodeLabel: innerText,
                  ariaLabel: hasAriaLabel(rest) ? rest['aria-label'] : ''
                }}
            >
                {(ariaLabel: string) => {
                  const nodeClasses = classNames(
                    'euiTreeView__node',
                    display ? displayToClassNameMap[display] : null,
                    {
                      'euiTreeView__node--expanded': this.isNodeOpen(
                        node
                      )
                    }
                  )

                  const nodeButtonClasses = classNames(
                    'euiTreeView__nodeInner',
                    showExpansionArrows && node.children
                      ? 'euiTreeView__nodeInner--withArrows'
                      : null,
                    this.props.activeItem === node.id
                      ? 'euiTreeView__node--active'
                      : null,
                    node.className ? node.className : null
                  )

                  return (
                    <React.Fragment>
                    <li className={nodeClasses}>
                        <button
                        id={buttonId}
                        aria-controls={wrappingId}
                        aria-expanded={this.isNodeOpen(node)}
                        ref={(ref) => this.setButtonRef(ref, index)}
                        data-test-subj={`euiTreeViewButton-${this.state.treeID}`}
                        onClick={() => this.handleNodeClick(node)}
                        className={nodeButtonClasses}
                        >
                        {showExpansionArrows && node.children
                          ? (
                            <EuiIcon
                            className="euiTreeView__expansionArrow"
                            size={display === 'compressed' ? 's' : 'm'}
                            type={
                                this.isNodeOpen(node)
                                  ? 'arrowDown'
                                  : 'arrowRight'
                            }
                            />
                            )
                          : null}
                        {node.icon && !node.useEmptyIcon
                          ? (
                            <span className="euiTreeView__iconWrapper">
                            {this.isNodeOpen(node) &&
                            node.iconWhenExpanded
                              ? node.iconWhenExpanded
                              : node.icon}
                            </span>
                            )
                          : null}
                        {node.useEmptyIcon && !node.icon
                          ? (
                            <span className="euiTreeView__iconPlaceholder" />
                            )
                          : null}
                        <span
                            ref={ref}
                            className="euiTreeView__nodeLabel"
                        >
                            {node.label}
                        </span>
                        </button>

                        {node.children && this.isNodeOpen(node)
                          ? this.renderBranch(node.children)
                          : null}

                    </li>
                    </React.Fragment>
                  )
                }}
            </EuiI18n>
            )}
        </EuiInnerText>
      )
    })}
    </ul>)
  }

  render () {
    const {
      items,
      display = 'default'
    } = this.props

    return (
      <EuiTreeViewContext.Provider value={this.state.treeID}>
        <EuiText
          size={display === 'compressed' ? 's' : 'm'}
          className="euiTreeView__wrapper"
        >
          {this.renderBranch(items)}
        </EuiText>
      </EuiTreeViewContext.Provider>
    )
  }
}
