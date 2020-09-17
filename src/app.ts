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

		map_to_world_transform: [16.0, 0.0, 0.0, 0.0, 0.0, 0.0, 512.0, 0.0, 0.0, -16.0, 0.0, 2048.0, 0.0, 0.0, 0.0, 1.0],
		world_to_map_transform: [0.0625, 0.0, 0.0, 0.0, 0.0, 0.0, -0.0625, 128.0, 0.0, 0.001953125, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0],
		terrain_size: 2048,
		terrain_height: 512,
		terrain_resolution: 128,
		world_to_clip_transform: [3.46892381, -0.134669766, 0.768378139, -4838.361, -0.7816217, 4.542998, 4.324941, -2435.3186, -0.233015925, -0.8926339, 0.8955274, 2057.63086, -0.181234613, -0.694270849, 0.696521342, 2510.60181],
		clip_to_view_transform: [0.28125003, 0.0, 0.0, 0.0, 0.0, 0.15820314, 0.0, 0.0, 0.0, 0.0, 0.0, -0.99999994, 0.0, 0.0, -0.000854492129, 0.0010986327],
		view_to_world_transform: [0.975634933, -0.123654991, 0.181234613, 1735.00012, -0.03787584, 0.718716562, 0.6942708, 1968.3999, 0.21610637, 0.684219241, -0.696521342, -1191.0, 0.0, 0.0, 0.0, 1.0],
		
		{
            Key: 'a',
            ResourceCards: [
                50,
                45,
                46,
                37,
            ],
            Type: 'meadow',
            WorldPosition: [
                1581.62,
                0.99,
                551.98,
                1.0,
            ],
            X: 360,
            Y: 500,
		},
		
		*/
		this.camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 4096 );
		this.camera.position.z = 1;
		//this.camera = new THREE.PerspectiveCamera( 21, window.innerWidth / window.innerHeight, 512, 4096 );
		//1735.0, 1968.4, -1191.0
		this.camera.position.set( 1735, 1968, 1191) ;
		//1581.62,0.99,551.98
		const target = new THREE.Vector3(1581,1,551)
		this.camera.lookAt(target);
		
		this.scene = new THREE.Scene();
	
		let geometry = new THREE.BoxGeometry( 50, 50, 50 );
		let material = new THREE.MeshNormalMaterial();
	
		this.mesh = new THREE.Mesh( geometry, material );
		this.mesh.position.copy(target);
		//this.mesh.position.set( );
		this.scene.add( this.mesh );

		let mesh2 = new THREE.Mesh( geometry, material );
		mesh2.position.set(1415.26, 1.0, 666.77);
		this.scene.add( mesh2 );

		let mesh3 = new THREE.Mesh( geometry, material );
		mesh3.position.set(1540.04, 1.07, 846.82);
		this.scene.add( mesh3 );
		
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
