import { h, app } from 'hyperapp'

const state = {
  pages: [
  ]
}

const actions = {
  addPage: () => ({pages}) => ({
    pages: (pages.push({id: pages.length}), pages)
  }),
  removePage: () => ({pages}) => ({
    pages: (pages.pop(), pages)
  })
}

const Page = ({pageNumber: id, addPage, removePage}) =>
  h('div', { class: 'page-container' }, [
    h('h1', {}, 'pageNumber'),
    h('button', {onclick: addPage}, '+ Add Page'),
    h('button', {onclick: removePage}, '- Remove Page')
  ])

const view = ({pages}, {addPage, removePage}) =>
  h('div', {}, [
    h('h1', {}, 'Lowest level'),
    h('button', {onclick: addPage}, '+ Add Page'),
    // console.log(state)
    pages.map(({id}) => (
      Page({id, addPage, removePage})
    ))
  ])

app(state, actions, view, document.body)
