import {h, app} from "hyperapp"


const state = {}

const actions = {}

const view = () =>
    h("h1", {}, "THIS IS WORKING")


app(state, actions, view, document.body)