var SCREEN_WIDTH = window.innerWidth,
SCREEN_HEIGHT = window.innerHeight,
SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

var camera, scene, renderer,
birds, bird;

var boid, boids;



init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	camera.position.z = 450;

	scene = new THREE.Scene();

	birds = [];
	boids = [];

	for ( var i = 0; i < 200; i ++ ) {

		boid = boids[ i ] = new Boid();
		boid.position.x = Math.random() * 400 - 200;
		boid.position.y = Math.random() * 400 - 200;
		boid.position.z = Math.random() * 400 - 200;
		boid.velocity.x = Math.random() * 2 - 1;
		boid.velocity.y = Math.random() * 2 - 1;
		boid.velocity.z = Math.random() * 2 - 1;
		boid.setAvoidWalls( true );
		boid.setWorldSize( 500, 500, 400 );

		bird = birds[ i ] = new THREE.Mesh( new Bird(), new THREE.MeshBasicMaterial( { color:Math.random() * 0xffffff, side: THREE.DoubleSide } ) );
		bird.phase = Math.floor( Math.random() * 62.83 );
		scene.add( bird );


	}

	renderer = new THREE.CanvasRenderer();
	renderer.setClearColor( 0xffffff );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.body.appendChild( renderer.domElement );



	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

	var vector = new THREE.Vector3( event.clientX - SCREEN_WIDTH_HALF, - event.clientY + SCREEN_HEIGHT_HALF, 0 );

	for ( var i = 0, il = boids.length; i < il; i++ ) {

		boid = boids[ i ];

		vector.z = boid.position.z;

		boid.repulse( vector );

	}

}


//

function animate() {

	requestAnimationFrame( animate );

	render();


}

function render() {

	for ( var i = 0, il = birds.length; i < il; i++ ) {

		boid = boids[ i ];
		boid.run( boids );

		bird = birds[ i ];
		bird.position.copy( boids[ i ].position );

		color = bird.material.color;
		color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000;

		bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
		bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );

		bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
		bird.geometry.vertices[ 5 ].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;

	}

	renderer.render( scene, camera );

}
