"use strict";

var Hexagon = function() {
	this.geo = new THREE.Geometry();

	this.geo.vertices.push(new THREE.Vector3(0, 0, 0));

	this.geo.vertices.push(new THREE.Vector3(1, 0, 0));
	this.geo.vertices.push(new THREE.Vector3(0.5, 0, -1));
	this.geo.vertices.push(new THREE.Vector3(-0.5, 0, -1));
	this.geo.vertices.push(new THREE.Vector3(-1, 0, 0));
	this.geo.vertices.push(new THREE.Vector3(-0.5, 0, 1));
	this.geo.vertices.push(new THREE.Vector3(0.5, 0, 1));

	this.geo.faces.push(new THREE.Face3( 0, 1, 2));
	this.geo.faces.push(new THREE.Face3( 0, 2, 3));
	this.geo.faces.push(new THREE.Face3( 0, 3, 4));
	this.geo.faces.push(new THREE.Face3( 0, 4, 5));
	this.geo.faces.push(new THREE.Face3( 0, 5, 6));
	this.geo.faces.push(new THREE.Face3( 0, 6, 1));

	this.geo.computeBoundingSphere();

	this.mat = new THREE.MeshBasicMaterial({color: 0xffff00});

	this.mesh = new THREE.Mesh(this.geo, this.mat);
};