/* eslint import/no-webpack-loader-syntax: off */

import React from 'react';
import {withStyles} from "@material-ui/core";
import vertShader from '!raw-loader!./shader.vert'
import fragShader from '!raw-loader!./shader.frag'


const styles = theme => ({
    canvas: {
        height: '100%',
        width: '100%',
    }
})

class App extends React.Component {
    /** @type {React.RefObject} */
    canvas = React.createRef()
    /** @type WebGLRenderingContext */
    gl = undefined

    /**
     *
     * @param {WebGLProgram} program
     * @param {string} vertSrc
     * @param {string} fragSrc
     */
    addShaders = (program, vertSrc, fragSrc) => {
        const gl = this.gl
        if (!gl) {
            return
        }
        const vertShader = gl.createShader(gl.VERTEX_SHADER)
        const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(vertShader, vertSrc)
        gl.shaderSource(fragShader, fragSrc)
        gl.compileShader(vertShader)
        if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(vertShader))
        }
        gl.compileShader(fragShader)
        if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(fragShader))
        }
        gl.attachShader(program, vertShader)
        gl.attachShader(program, fragShader)
    }

    addRainbowTriangle = (program) => {
        const gl = this.gl
        const triangleVertices = new Float32Array([
             // xy         rgb
             0.0,  0.5,    1.0, 1.0, 0.0,
            -0.5, -0.5,    0.7, 0.0, 1.0,
             0.5, -0.5,    0.1, 1.0, 0.6
        ]);
        const triangleVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
        const positionAttribLocation = gl.getAttribLocation(program, 'position');
        const colorAttribLocation = gl.getAttribLocation(program, 'color');
        gl.vertexAttribPointer(
            positionAttribLocation,
            2,
            gl.FLOAT,
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        gl.vertexAttribPointer(
            colorAttribLocation,
            3,
            gl.FLOAT,
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT,
            2 * Float32Array.BYTES_PER_ELEMENT
        );

        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);
    }


    componentDidMount() {
        const canvas = this.canvas
        this.gl = canvas.current.getContext('webgl')
        const gl = this.gl

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



        const program = gl.createProgram()
        this.addShaders(program, vertShader, fragShader)



        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('ERROR linking program!', gl.getProgramInfoLog(program));
            return;
        }
        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            console.error('ERROR validating program!', gl.getProgramInfoLog(program));
            return;
        }

        this.addRainbowTriangle(program)

        gl.useProgram(program);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    render() {
        const { classes } = this.props
        return (
            <canvas
                className={classes.canvas}
                ref={this.canvas}
                id="glcanvas"
            >
            </canvas>
        )
    }
}


export default withStyles(styles, { withTheme: true })(App)
