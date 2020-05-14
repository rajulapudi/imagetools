import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Components/Home/Home'
import Compress from './Components/img-tools/Compress'
import Resize from './Components/img-tools/Resize'
import Editor from './Components/img-tools/Editor'
import Watermark from './Components/img-tools/Watermark'
import Crop from './Components/img-tools/Crop'
import Rotate from './Components/img-tools/Rotate'
import WebPConverter from './Components/img-tools/WebPConverter'


export default function Routes() {
    return (
        <Router>
            <Switch>
                <Route
                    path={`/image-editor`}
                    exact
                    component={Editor}
                />
                <Route
                    path={`/convert-webp`}
                    exact
                    component={WebPConverter}
                />
                <Route
                    path={`/rotate`}
                    exact
                    component={Rotate}
                />
                <Route
                    path={`/compress`}
                    exact
                    component={Compress}
                />
                <Route
                    path={`/crop`}
                    exact
                    component={Crop}
                />
                <Route
                    path={`/watermark`}
                    exact
                    component={Watermark}
                />
                <Route
                    path={`/resize`}
                    exact
                    component={Resize}
                />
                <Route
                    path={`/`}
                    exact
                    component={Home}
                />
            </Switch>
        </Router>
    )
}
