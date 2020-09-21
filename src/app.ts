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
	private texture : THREE.Texture;

	constructor() {
		/*
		const canvas = <HTMLCanvasElement>document.getElementById('canvas');
		this.gl = canvas.getContext('webgl');
		this.shader = new Shader();

		this.gl.viewport(0, 0, canvas.width, canvas.height);
		this.gl.clearColor(0, 0, 0, 1);
		*/
	}

	init() {
		const canvas = <HTMLCanvasElement>document.getElementById('canvas');
		const ratio = canvas.width / canvas.height;
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

		Unity Camera
		Unity rotation : ZXY :
		rot = [43.96, -14.58, -3.017]
		position =  1735, 1968, -1191
		
		unity RH Rot :  ZXY   [ x: 43.96, y: -14.58, z: -3.017 ]    quat [ 0.3680311, -0.127401, -0.0716913, 0.9182497 ]
		                    [ x: 45, y: 0, z: 0 ]         [ -0.4871745, 0, 0, -0.8733046 ]
		Three LH Rot :  XYZ   [ x: 43.3495146, y: -16.6629511, z: -2.2664458 ]  quat [ 0.3679486, -0.1274039, -0.0716197, 0.9182879 ]
		*/
		this.camera = new THREE.PerspectiveCamera( 21.23931, ratio, 512, 4096 ); //21.23931
		this.camera.position.set( 1735, 1968.4, -1191) ;
		const posR = new THREE.Vector3(1581, 1.0,551);
		const posG = new THREE.Vector3(1415.26, 1.0, 666.77);
		const posB = new THREE.Vector3(1540.04, 1.07, 846.82);
		
		
		this.scene = new THREE.Scene();
		//background
		const textureImage = require('../background.png');
		this.texture = new THREE.TextureLoader().load(textureImage.default);
		
		this.scene.background = this.texture;


		const depthImage = require('../depth.png');
		

		const color = 0xFFFFFF;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		this.scene.add(light);

		var helper = new THREE.CameraHelper( this.camera );
		this.scene.add( helper );
		var axesHelper = new THREE.AxesHelper( 10000 );
		this.scene.add( axesHelper );

		var boxR = new THREE.Box3(posR);
		var boxG = new THREE.Box3(posG);
		var boxB = new THREE.Box3(posB);


		let geometry = new THREE.BoxGeometry( 50, 50, 50 );
		let material = new THREE.MeshNormalMaterial();
		this.mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {color: 'red'} ) );
		this.mesh.position.copy(posR);
		//this.mesh.position.set( );
		this.scene.add( this.mesh );
		let mesh1 = this.mesh;

		let mesh2 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {color: 'green'} ) );
		mesh2.position.copy(posG);
		this.scene.add( mesh2 );

		let mesh3 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {color: 'blue'} ) );
		mesh3.position.copy(posB);
		this.scene.add( mesh3 );

		const sphere = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {color: 'white'} ) );
		this.scene.add( sphere );
		
		this.renderer = new THREE.WebGLRenderer( { canvas: canvas } ); // alpha: true, antialias: true
		this.renderer.autoClearColor = false;
		this.renderer.setSize( canvas.width , canvas.height );
		document.body.appendChild( this.renderer.domElement );
		this.drawBound = this.draw.bind(this);
		requestAnimationFrame(this.drawBound);

		
		// convert Quaternion from Left-handed coordinate system to Right-handed
		// const UQuat = [ 0.3679486, -0.1274039, -0.0716197, 0.9182879 ];
		// const UQuatA = [ -0.4871745, 0, 0, -0.8733046 ];
		// let UQuat = new THREE.Quaternion();
		// UQuat.fromArray(UQuatA );
		
		//[43.96, -14.58, -3.017]
		let angleX = 43.96;
		let angleY = -14.58;
		let angleZ = -3.017; //-14.58;
		
		/* Euler Approach */
		// ZXY <> XYZ and LH > RH.  
		// Flip Y and Z : ZXY > YXZ 
		let cameraRot = [THREE.MathUtils.degToRad(-angleX),THREE.MathUtils.degToRad(-angleY), THREE.MathUtils.degToRad(angleZ)]
		var unityEuler = new THREE.Euler( cameraRot[0], cameraRot[1], cameraRot[2], 'YXZ' ); 
		// unityEuler.reorder('XYZ');
		

		/* Quaternion Approach */
		/*
		var unityQuat = new THREE.Quaternion();
		var unityEuler = new THREE.Euler(THREE.MathUtils.degToRad(angleX), THREE.MathUtils.degToRad(angleY),THREE.MathUtils.degToRad(angleZ), 'ZXY' ); 
		unityQuat.setFromEuler(unityEuler);
		//https://stackoverflow.com/questions/18066581/convert-unity-transforms-to-three-js-rotations
		// var q = new THREE.Quaternion( -UQuat[0], -UQuat[2], -UQuat[1], UQuat[3] );
		const UQuat = unityQuat;
		var q = new THREE.Quaternion( UQuat.x, -UQuat.z, -UQuat.y, UQuat.w );
		//var q = new THREE.Quaternion( -UQuat.x, -UQuat.y, -UQuat.z, UQuat.w );
		var v = new THREE.Euler();  
		v.setFromQuaternion( q );
		unityEuler = v;
		*/
		this.camera.setRotationFromEuler( unityEuler );
		
		this.camera.position.set( this.camera.position.x, this.camera.position.y, -this.camera.position.z) ;
		mesh1.position.set( mesh1.position.x, mesh1.position.y, -mesh1.position.z) ;
		mesh2.position.set( mesh2.position.x, mesh2.position.y, -mesh2.position.z) ;
		mesh3.position.set( mesh3.position.x, mesh3.position.y, -mesh3.position.z) ;

		/*
		// https://stackoverflow.com/questions/1263072/changing-a-matrix-from-right-handed-to-left-handed-coordinate-system
		var flip = new THREE.Matrix4();
		flip.set(   1, 0, 0, 0,
					0, 0, 1, 0,
					0, 1, 0, 0,
					0, 0, 0, 1 );
	   
		let mCamera = this.camera.matrix;
		mCamera.multiply(flip);
		//mCamera.premultiply(flip);
		this.camera.matrix.copy(mCamera);
		this.camera.updateMatrixWorld( true );
		*/
		
		//v.setFromQuaternion( unityQuat );
		// v.y += Math.PI; // Y is 180 degrees off
		// v.z *= -1; // flip Z

		// var mR = new THREE.Euler( 43.96, -14.58, -3.017, 'ZXY' );
		// this.camera.position.set( 1735, 1968, -1191) ;
		// this.camera.setRotationFromEuler( mR );
		
		

		//Draw Line
		var lm = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 10 } );
		var points = [];
		points.push( mesh1.position );
		points.push( mesh2.position );
		var lg = new THREE.BufferGeometry().setFromPoints( points );
		var line = new THREE.Line( lg, lm );
		this.scene.add( line );

		//Draw Circle
		var cg = new THREE.CircleGeometry( 60, 32 );
		var cm = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		var circle = new THREE.Mesh( cg, cm );
		circle.position.set(mesh3.position.x, mesh3.position.y+300, mesh3.position.z-50)
		//this.scene.add( circle );

		//Face Mesh
		var fg = new THREE.Geometry();
		fg.vertices.push(
			new THREE.Vector3(-1, -1,  0),  // 0
			new THREE.Vector3( 1, -1,  0),  // 1
			new THREE.Vector3(-1,  1,  0),  // 2
			new THREE.Vector3( 1,  1,  0),  // 3
		);

		fg.faces.push(
			new THREE.Face3(0, 3, 2),
			new THREE.Face3(0, 1, 3),
		);

		const fm = new THREE.MeshBasicMaterial({color: 0xFF4444});
		const face = new THREE.Mesh(fg, fm);
		face.position.set(mesh2.position.x, mesh2.position.y-100, mesh2.position.z-50)
		face.scale.set(60, 60, 60);
		//this.scene.add(face);
		  
		
	}

	resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
		  renderer.setSize(width, height, false);
		}
		return needResize;
	  }

	draw(time: number) {
		/*
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
		
		*/
		

		if (this.resizeRendererToDisplaySize(this.renderer)) {
			const canvas = this.renderer.domElement;
			this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
			this.camera.updateProjectionMatrix();
		  }

		//this.mesh.rotation.x += 0.01;
    	//this.mesh.rotation.y += 0.04;
 
		this.renderer.render( this.scene, this.camera );
		requestAnimationFrame(this.drawBound);
	}
	/*
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
	*/
}
