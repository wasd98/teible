import { shallowMount } from '@vue/test-utils'
import DataTablePagination from '../src/DataTablePagination.vue'

describe('DataTablePagination', () => {
  // wrapper.setProps lines are to mock two-way binding

  it(`renders correctly`, () => {
    let wrapper = shallowMount(DataTablePagination, {
      propsData: {
        total: 10,
        page: 2,
        perPage: 3
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it(`renders correctly with invalid perPage`, () => {
    let wrapper = shallowMount(DataTablePagination, {
      propsData: {
        total: 10,
        page: 1,
        perPage: 0
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it(`renders correctly when total change`, () => {
    let wrapper = shallowMount(DataTablePagination, {
      propsData: {
        total: 10,
        page: 4,
        perPage: 3
      }
    })
    expect(wrapper.html()).toMatchSnapshot()

    wrapper.setProps({
      total: 9
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it(`emits update:page events`, () => {
    let wrapper = shallowMount(DataTablePagination, {
      propsData: {
        total: 10,
        perPage: 3,
        page: 2
      }
    })

    wrapper.find('.datatable__pprev').trigger('click')
    expect(wrapper.emitted()).toEqual({ 'update:page': [[1]] })
    wrapper.setProps({
      'page': 1
    })

    /*
      Nothing emitted since we reached the first page
    */
    wrapper.find('.datatable__pprev').trigger('click')
    expect(wrapper.emitted()).toEqual({ 'update:page': [[1]] })

    wrapper.findAll('.datatable__plink').at(4).trigger('click')
    expect(wrapper.emitted()).toEqual({ 'update:page': [[1], [4]] })
    wrapper.setProps({
      'page': 4
    })

    /*
      Nothing emitted since we reached the last page
    */
    wrapper.find('.datatable__pnext').trigger('click')
    expect(wrapper.emitted()).toEqual({ 'update:page': [[1], [4]] })
  })

  it(`does not emit update:page event when clicking on the three-dots button`, () => {
    let wrapper = shallowMount(DataTablePagination, {
      propsData: {
        total: 10,
        page: 1,
        perPage: 1
      }
    })
    expect(wrapper.html()).toMatchSnapshot() // < [1] 2 3 ... 9 10 >

    wrapper.findAll('.datatable__plink').at(2).trigger('click')
    expect(wrapper.emitted()).toEqual({ 'update:page': [[2]] }) // < 1 [2] 3 ... 9 10 >
    wrapper.setProps({
      'page': 2
    })

    // Clicking on the [...]
    wrapper.findAll('.datatable__plink').at(4).trigger('click')
    expect(wrapper.emitted()).toEqual({ 'update:page': [[2]] }) // < 1 [2] 3 ... 9 10 >

    wrapper.findAll('.datatable__plink').at(6).trigger('click')
    expect(wrapper.emitted()).toEqual({ 'update:page': [[2], [10]] }) // < 1 2 3 ... 9 [10] >
    wrapper.setProps({
      'page': 10
    })
  })
})
