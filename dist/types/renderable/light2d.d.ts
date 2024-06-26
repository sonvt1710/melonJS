/**
 * A 2D point light.
 * Note: this is a very experimental and work in progress feature, that provides a simple spot light effect.
 * The light effect is best rendered in WebGL, as they are few limitations when using the Canvas Renderer
 * (multiple lights are not supported, alpha component of the ambient light is ignored)
 * @see stage.lights
 */
export default class Light2d extends Renderable {
    /**
     * @param {number} x - The horizontal position of the light.
     * @param {number} y - The vertical position of the light.
     * @param {number} radiusX - The horizontal radius of the light.
     * @param {number} [radiusY=radiusX] - The vertical radius of the light.
     * @param {Color|string} [color="#FFF"] - the color of the light
     * @param {number} [intensity=0.7] - The intensity of the light.
     */
    constructor(x: number, y: number, radiusX: number, radiusY?: number | undefined, color?: string | Color | undefined, intensity?: number | undefined);
    /**
     * the color of the light
     * @type {Color}
     * @default "#FFF"
     */
    color: Color;
    /**
     * The horizontal radius of the light
     * @type {number}
     */
    radiusX: number;
    /**
     * The vertical radius of the light
     * @type {number}
     */
    radiusY: number;
    /**
     * The intensity of the light
     * @type {number}
     * @default 0.7
     */
    intensity: number;
    /** @ignore */
    visibleArea: object;
    /** @ignore */
    texture: object;
    /**
     * returns a geometry representing the visible area of this light
     * @name getVisibleArea
     * @memberof Light2d
     * @returns {Ellipse} the light visible mask
     */
    getVisibleArea(): Ellipse;
    /**
     * draw this Light2d (automatically called by melonJS)
     * @name draw
     * @memberof Light2d
     * @param {CanvasRenderer|WebGLRenderer} renderer - a renderer instance
     * @param {Camera2d} [viewport] - the viewport to (re)draw
     */
    draw(renderer: CanvasRenderer | WebGLRenderer): void;
    /**
     * Destroy function<br>
     * @ignore
     */
    destroy(): void;
}
import Renderable from "./renderable.js";
import type Color from "./../math/color.js";
import type Ellipse from "./../geometries/ellipse.js";
import type CanvasRenderer from "./../video/canvas/canvas_renderer.js";
import type WebGLRenderer from "./../video/webgl/webgl_renderer.js";
