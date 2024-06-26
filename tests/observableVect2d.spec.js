import { describe, expect, it } from "vitest";
import { ObservableVector2d, Vector2d, math } from "../src/index.js";

describe("ObservableVector2d", () => {
	const x = 1;
	const y = 2;

	let a;
	let b;
	let c;

	let _newX;
	let _newY;
	let _oldX;
	let _oldY;

	const callback = function (newX, newY, oldX, oldY) {
		// this will also validate the argument list
		_newX = newX;
		_newY = newY;
		_oldX = oldX;
		_oldY = oldY;
	};

	const callback_with_ret = function () {
		return {
			x: 10,
			y: 10,
		};
	};

	it("should be initialized to a (0, 0) 2d vector", function () {
		a = new ObservableVector2d(0, 0, {
			onUpdate: callback.bind(this),
		});
		b = new ObservableVector2d(0, 0, {
			onUpdate: callback.bind(this),
		});
		c = new ObservableVector2d(0, 0, {
			onUpdate: callback.bind(this),
		});

		expect(a.toString()).toEqual("x:0,y:0");
	});

	it("setting the vector triggers the callback", () => {
		a.set(10, 100);
		expect(a.x + a.y).toEqual(_newX + _newY);
	});

	it("callback returns a vector value", function () {
		const d = new ObservableVector2d(0, 0, {
			onUpdate: callback_with_ret.bind(this),
		});
		d.set(100, 100);
		expect(d.x + d.y).toEqual(20); // 10 + 10
	});

	it("add a vector triggers the callback", () => {
		a.add(new Vector2d(10, 10));
		expect(a.y).toEqual(_oldY + 10);
	});

	it("sub a vector triggers the callback", () => {
		a.sub(new Vector2d(10, 10));
		expect(a.x).toEqual(_oldX - 10);
	});

	it("a(1, 2) should be copied into b", () => {
		a.set(x, y);
		b.copy(a);

		expect(b.equals(a)).toEqual(true);
	});

	it("scale (1, 2) by (-1, -2)", () => {
		a.set(x, y);
		b.set(-x, -y);

		expect(a.scaleV(b).toString()).toEqual("x:" + x * -x + ",y:" + y * -y);
	});

	it("negate (1, 2)", () => {
		a.set(x, y);

		expect(a.negateSelf().toString()).toEqual("x:" + -x + ",y:" + -y);
	});

	it("dot Product (1, 2) and (-1, -2)", () => {
		a.set(x, y);
		b.set(-x, -y);

		// calculate the dot product
		expect(a.dot(b)).toEqual(-x * x - y * y);
	});

	it("cross Product (2, 3) and (5, 6)", () => {
		a.set(2, 3);
		b.set(5, 6);

		// calculate the cross product
		expect(a.cross(b)).toEqual(-3);
	});

	it("length/lengthSqrt functions", () => {
		a.set(x, 0);
		b.set(0, -y);
		c.set(0, 0);

		expect(a.length()).toEqual(x);
		expect(a.length2()).toEqual(x * x);
		expect(b.length()).toEqual(y);
		expect(b.length2()).toEqual(y * y);
		expect(c.length()).toEqual(0);
		expect(c.length2()).toEqual(0);

		a.set(x, y);
		expect(a.length()).toEqual(Math.sqrt(x * x + y * y));
		expect(a.length2()).toEqual(x * x + y * y);
	});

	it("lerp functions", () => {
		a.set(x, 0);
		b.set(0, -y);

		expect(a.clone().lerp(a, 0).equals(a.lerp(a, 0.5))).toEqual(true);
		expect(a.clone().lerp(a, 0).equals(a.lerp(a, 1))).toEqual(true);

		expect(a.clone().lerp(b, 0).equals(a)).toEqual(true);

		expect(a.clone().lerp(b, 0.5).x).toEqual(x * 0.5);
		expect(a.clone().lerp(b, 0.5).y).toEqual(-y * 0.5);

		expect(a.clone().lerp(b, 1).equals(b)).toEqual(true);
	});

	it("normalize function", () => {
		a.set(x, 0);
		b.set(0, -y);

		a.normalize();
		expect(a.length()).toEqual(1);
		expect(a.x).toEqual(1);

		b.normalize();
		expect(b.length()).toEqual(1);
		expect(b.y).toEqual(-1);
	});

	it("distance function", () => {
		a.set(x, 0);
		b.set(0, -y);
		c.set(0, 0);

		expect(a.distance(c)).toEqual(x);
		expect(b.distance(c)).toEqual(y);
	});

	it("min/max/clamp", () => {
		a.set(x, y);
		b.set(-x, -y);
		c.set(0, 0);

		c.copy(a).minV(b);
		expect(c.x).toEqual(-x);
		expect(c.y).toEqual(-y);

		c.copy(a).maxV(b);
		expect(c.x).toEqual(x);
		expect(c.y).toEqual(y);

		c.set(-2 * x, 2 * x);
		c.clampSelf(-x, x);
		expect(c.x).toEqual(-x);
		expect(c.y).toEqual(x);
	});

	it("ceil/floor", () => {
		expect(
			a.setMuted(-0.1, 0.1).floorSelf().equals(new Vector2d(-1, 0)),
		).toEqual(true);
		expect(
			b.setMuted(-0.5, 0.5).floorSelf().equals(new Vector2d(-1, 0)),
		).toEqual(true);
		expect(
			c.setMuted(-0.9, 0.9).floorSelf().equals(new Vector2d(-1, 0)),
		).toEqual(true);

		expect(a.setMuted(-0.1, 0.1).ceilSelf().equals(new Vector2d(0, 1))).toEqual(
			true,
		);
		expect(b.setMuted(-0.5, 0.5).ceilSelf().equals(new Vector2d(0, 1))).toEqual(
			true,
		);
		expect(c.setMuted(-0.9, 0.9).ceilSelf().equals(new Vector2d(0, 1))).toEqual(
			true,
		);
	});

	it("project a on b", () => {
		a.set(x, y);
		b.set(-x, -y);

		// the following only works with (-)1, (-)2style of values
		expect(a.project(b).equals(b)).toEqual(true);
	});

	it("angle between a and b", () => {
		a.set(x, y);
		b.set(-x, -y);

		// why is this not perfectly 180 degrees ?
		expect(Math.round(math.radToDeg(a.angle(b)))).toEqual(180);

		b.set(4 * x, -y);
		expect(a.angle(b)).toEqual(Math.PI / 2);
	});

	it("perp and rotate function", () => {
		a.set(x, y);
		b.copy(a).perp();
		// perp rotate the vector by 90 degree clockwise on the z axis
		c.copy(a).rotate(Math.PI / 2);

		expect(a.angle(b)).toEqual(a.angle(c));
	});
});
