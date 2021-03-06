import { load, defaultProps, dotSet, paginate, orderBy } from '../src/helpers'

describe('load', () => {
  const data = [{
    id: 1,
    name: 'One'
  }, {
    id: 2,
    name: 'Two'
  }, {
    id: 3,
    name: 'Three'
  }, {
    id: 4,
    name: 'Four'
  }, {
    id: 5,
    name: 'Five'
  }]

  it('works', () => {
    expect(load(data, {
      query: 'e',
      fields: ['name']
    }, {
      by: 'id',
      order: 'desc'
    }, {
      perPage: 2,
      page: 1
    })).toEqual({
      items: [
        data[4],
        data[2]
      ],
      total: 3
    })
  })

  it('filters', () => {
    expect(load(data, {
      query: 'x',
      fields: ['name']
    }, {
      by: 'id'
    }, {
      perPage: 3,
      page: 1
    })).toEqual({
      items: [],
      total: 0
    })
  })

  it('filters with an invalid field', () => {
    expect(load(data, {
      query: 'o',
      fields: ['name', 'invalid']
    }, {
      by: 'id'
    }, {
      perPage: 3,
      page: 1
    })).toEqual({
      items: [
        data[0],
        data[1],
        data[3]
      ],
      total: 3
    })
  })

  it('sorts', () => {
    expect(load(data, {
      query: 'e',
      fields: ['name']
    }, {
      by: 'id'
    }, {
      perPage: 2,
      page: 1
    })).toEqual({
      items: [
        data[0],
        data[2]
      ],
      total: 3
    })
  })

  it('paginates', () => {
    expect(load(data, {
      query: 'o',
      fields: ['name']
    }, {
      by: 'id'
    }, {
      perPage: 1,
      page: 2
    })).toEqual({
      items: [
        data[1]
      ],
      total: 3
    })
  })

  it('paginates with an invalid page', () => {
    expect(load(data, {
      query: 'o',
      fields: ['name']
    }, {
      by: 'id'
    }, {
      perPage: 0,
      page: 2
    })).toEqual({
      items: [],
      total: 3
    })
  })
})

describe('defaultProps', () => {
  it('works', () => {
    expect(defaultProps({
      key: {
        type: String,
        default: 'default string'
      }
    }, {
    })).toEqual({key: 'default string'})

    expect(defaultProps({
      key: {
        type: Object,
        default: () => ({})
      }
    }, {
    })).toEqual({key: {}})
  })
})

describe('dotSet', () => {
  it('works', () => {
    let obj = {
      foo: {
        bar: 'qux'
      }
    }

    dotSet(obj, 'foo.bar', true)
    expect(obj.foo.bar).toBe(true)

    dotSet(obj, 'another.path', true)
    expect(obj.another.path).toBe(true)
  })
})

describe('paginate', () => {
  it('works', () => {
    expect(paginate(1, 5)).toEqual([
      { value: 1, disabled: false },
      { value: 2, disabled: false },
      { value: 3, disabled: false },
      { value: 4, disabled: false },
      { value: 5, disabled: false }
    ])

    expect(paginate(1, 10)).toEqual([
      { value: 1, disabled: false },
      { value: 2, disabled: false },
      { value: '...', disabled: true },
      { value: 9, disabled: false },
      { value: 10, disabled: false }
    ])

    expect(paginate(5, 9)).toEqual([
      { value: 1, disabled: false },
      { value: 2, disabled: false },
      { value: '...', disabled: true },
      { value: 4, disabled: false },
      { value: 5, disabled: false },
      { value: 6, disabled: false },
      { value: '...', disabled: true },
      { value: 8, disabled: false },
      { value: 9, disabled: false }
    ])

    expect(paginate(6, 10)).toEqual([
      { value: 1, disabled: false },
      { value: 2, disabled: false },
      { value: '...', disabled: true },
      { value: 5, disabled: false },
      { value: 6, disabled: false },
      { value: 7, disabled: false },
      { value: '...', disabled: true },
      { value: 9, disabled: false },
      { value: 10, disabled: false }
    ])
  })
})

describe('orderBy', () => {
  it('works with an empty array', () => {
    expect(orderBy([], '')).toEqual([])
  })

  it('works with strings', () => {
    const sample = [{ value: 'gAmMa' }, { value: 'Alpha' }, { value: 'beta' }, { value: 'beta' }]
    expect(orderBy(sample, 'value')).toEqual([{ value: 'Alpha' }, { value: 'beta' }, { value: 'beta' }, { value: 'gAmMa' }])
    expect(orderBy(sample, 'value', 'desc')).toEqual([{ value: 'gAmMa' }, { value: 'beta' }, { value: 'beta' }, { value: 'Alpha' }])
  })

  it('works with numbers', () => {
    const sample = [{ value: 1 }, { value: 3 }, { value: 1 }, { value: 2.5 }]
    expect(orderBy(sample, 'value')).toEqual([{ value: 1 }, { value: 1 }, { value: 2.5 }, { value: 3 }])
    expect(orderBy(sample, 'value', 'desc')).toEqual([{ value: 3 }, { value: 2.5 }, { value: 1 }, { value: 1 }])
  })

  it('works with other dates', () => {
    const november = new Date('11/12/2013')
    const october = new Date('10/13/2013')
    const sample = [{ value: november }, { value: october }]
    expect(orderBy(sample, 'value')).toEqual([{ value: october }, { value: november }])
    expect(orderBy(sample, 'value', 'desc')).toEqual([{ value: november }, { value: october }])
  })

  it('works with empty null & undefined', () => {
    const sample = [{ value: 'a' }, { value: '' }, { value: null }, { value: undefined }, { value: 'b' }, {}]
    expect(orderBy(sample, 'value')).toEqual([{ value: '' }, { value: null }, { value: undefined }, {}, { value: 'a' }, { value: 'b' }])
    expect(orderBy(sample, 'value', 'desc')).toEqual([{ value: 'b' }, { value: 'a' }, { value: '' }, { value: null }, { value: undefined }, {}])
  })

  it('works with mixed types', () => {
    const sample = [{ value: 0 }, { value: '0' }, { value: 1.1 }, { value: '1' }]
    expect(orderBy(sample, 'value')).toEqual([{ value: 0 }, { value: '0' }, { value: '1' }, { value: 1.1 }])
    expect(orderBy(sample, 'value', 'desc')).toEqual([{ value: 1.1 }, { value: '1' }, { value: 0 }, { value: '0' }])
  })
})
