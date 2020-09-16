import { Shader } from './shader';
import * as THREE from 'three';

export class App {
	private gl: WebGLRenderingContext;
	private shaderProgram: WebGLProgram;
	private shader: Shader;
	private drawBound: (time: number) => void;
	private mesh : THREE.Mesh;
	private renderer : THREE.WebGLRenderer;
	private scene : THREE.Scene;
	private camera : THREE.PerspectiveCamera;

	constructor() {
		const canvas = <HTMLCanvasElement>document.getElementById('canvas');
		this.gl = canvas.getContext('webgl');
		this.shader = new Shader();

		this.gl.viewport(0, 0, canvas.width, canvas.height);
		this.gl.clearColor(0, 0, 0, 1);
	}

	init() {
		/*
		this.createShaders();
		this.createVertices();
		this.drawBound = this.draw.bind(this);
		requestAnimationFrame(this.drawBound);
		// this.draw()
		*/
		/*
		Position (1735.0, 1968.4, -1191.0)
		Direction (0.2, 0.7, 0.7)
		Fov 21.23931
		Near: 512, Far: 4096
		*/
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
		this.camera.position.z = 1;
	
		this.scene = new THREE.Scene();
	
		let geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
		let material = new THREE.MeshNormalMaterial();
	
		this.mesh = new THREE.Mesh( geometry, material );
		this.scene.add( this.mesh );
	
		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );
		this.drawBound = this.draw.bind(this);
		requestAnimationFrame(this.drawBound);
	}

	draw(time: number) {
		/*
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
		
		*/
		this.mesh.rotation.x += 0.01;
    	this.mesh.rotation.y += 0.04;
 
		this.renderer.render( this.scene, this.camera );
		requestAnimationFrame(this.drawBound);
	}

	createShaders() {
		// to put webgl shaders into the page, we need to create a 'program',
		// and attach vertex & fragment shaders into the program
		this.shaderProgram = this.shader.initShaderProgram(this.gl);
		this.gl.useProgram(this.shaderProgram);
	}

	// pass in attributes from the main program (js) to shaders
	// so we can set dynamic values to the shaders here
	createVertices() {
		const vertices = [0.1, -0.5, 0.0, -0.9, 0.9, 0.0, 0.5, 0.9, 0.0];
		const buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(vertices),
			this.gl.STATIC_DRAW
		);

		const coords = this.gl.getAttribLocation(this.shaderProgram, 'coords');
		this.gl.vertexAttribPointer(coords, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(coords);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

		const point = this.gl.getAttribLocation(this.shaderProgram, 'pointSize');
		this.gl.vertexAttrib1f(point, 100);

		const color = this.gl.getUniformLocation(this.shaderProgram, 'color');
		this.gl.uniform4f(color, 1, 1, 0, 0.7);
	}
}
