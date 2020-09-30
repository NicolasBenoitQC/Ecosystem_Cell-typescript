import React, {useState} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MindMapBuilder } from './MindMapBuilder';

import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from 'enzyme';

configure({ adapter: new Adapter() });


describe("Test", () => {
    const mountWrapper = () => {
        return mount(
            <Router>
                <Route path='/' exact component={MindMapBuilder} />
            </Router>
        );
    };

    it("Should render correctly", () => {
        mountWrapper();
    });
 
    it('Should display the stem cell', ():void => {
        expect.assertions(1);

        const wrapper = mountWrapper();
      //console.log(wrapper)
      expect(wrapper.find("MindMapBuilder").exists()).toBeTruthy();
    })
});

