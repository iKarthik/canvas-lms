/*
 * Copyright (C) 2015 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import $ from 'jquery'
import React from 'react'
import {render} from '@testing-library/react'
import {shallow} from 'enzyme'
import UsageRightsSelectBox from '../UsageRightsSelectBox'
import sinon from 'sinon'

const ok = x => expect(x).toBeTruthy()
const equal = (x, y) => expect(x).toEqual(y)

describe('UsageRightsSelectBox', () => {
  test('shows alert message if nothing is chosen and component is setup for a message', () => {
    const wrapper = shallow(<UsageRightsSelectBox showMessage={true} />)
    ok(
      wrapper
        .find('.alert')
        .text()
        .includes(
          "If you do not select usage rights now, this file will be unpublished after it's uploaded."
        ),
      'message is being shown'
    )
  })

  test('fetches license options when component mounts', () => {
    const server = sinon.fakeServer.create()
    const ref = React.createRef()
    render(<UsageRightsSelectBox showMessage={false} ref={ref} />)
    server.respond('GET', '', [
      200,
      {'Content-Type': 'application/json'},
      JSON.stringify([
        {
          id: 'cc_some_option',
          name: 'CreativeCommonsOption',
        },
      ]),
    ])
    equal(ref.current.state.licenseOptions[0].id, 'cc_some_option', 'sets data just fine')
    server.restore()
  })

  test('inserts copyright into textbox when passed in', () => {
    const copyright = 'all dogs go to taco bell'
    const wrapper = shallow(<UsageRightsSelectBox copyright={copyright} />)
    equal(wrapper.find('#copyrightHolder').find('input').prop('defaultValue'), copyright)
  })

  test('shows creative commons options when set up', () => {
    const server = sinon.fakeServer.create()
    const props = {
      copyright: 'loony',
      use_justification: 'creative_commons',
      cc_value: 'helloooo_nurse',
    }
    const ref = React.createRef()
    render(<UsageRightsSelectBox {...props} ref={ref} />)
    server.respond('GET', '', [
      200,
      {'Content-Type': 'application/json'},
      JSON.stringify([
        {
          id: 'cc_some_option',
          name: 'CreativeCommonsOption',
        },
      ]),
    ])

    equal(ref.current.creativeCommons.value, 'cc_some_option', 'shows creative commons option')
    server.restore()
  })

  $('div.error_box').remove()
})
