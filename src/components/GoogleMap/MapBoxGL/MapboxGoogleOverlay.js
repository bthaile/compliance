/*
Copyright (c) 2016, Mapbox

All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.
    * Neither the name of Mapbox GL JS nor the names of its contributors
      may be used to endorse or promote products derived from this software
      without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

-------------------------------------------------------------------------------

Contains glmatrix.js

Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

-------------------------------------------------------------------------------

Contains Hershey Simplex Font: http://paulbourke.net/dataformats/hershey/

-------------------------------------------------------------------------------

Contains code from glfx.js

Copyright (C) 2011 by Evan Wallace

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

--------------------------------------------------------------------------------

Contains a portion of d3-color https://github.com/d3/d3-color

Copyright 2010-2016 Mike Bostock
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the author nor the names of contributors may be used to
  endorse or promote products derived from this software without specific prior
  written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* global google document */
var TILE_SIZE = 256;

// This is designed to be used with Object.freeze (because it's slow in Vue otherwise)

export class MapboxGoogleOverlay {
  constructor(options) {
    this.mapboxgl = require("./mapbox-gl");
    this.Evented = this.mapboxgl.Evented;
    this.mapboxRenderer = new this.mapboxgl.BasicRenderer(options);
    this.styleLoadedPromise = new Promise(res =>
      this.mapboxRenderer.on("data", data => data.dataType === "style" && res()),
    );
    this.tileSize = new google.maps.Size(TILE_SIZE, TILE_SIZE);
    this.minZoom = options.minZoom || 4;
    this.maxZoom = options.maxZoom || 24;
    this._unusedTilesPool = [];
    this._visibleTiles = new Map(); // domEl => {canv, ctx, coord, zoom, renderRef}
    this._dummyTile = document.createElement("div");

    // some stuff for events, which the consumer may want
    this.evented = new this.Evented();
    this.on = this.evented.on.bind(this.evented);
    this.off = this.evented.on.bind(this.evented);
    this.mapboxRenderer.setEventedParent(this.evented, {});
    this._renderInfo = {
      tilesPending: 0,
      errors: 0,
      startTime: null,
    };
    this._thawed = {
      // to allow for changing despite Object.freeze, some can be set externally with setMouseOptions method
      map: null,
      _mousemove: null,
      _click: null,
      mouseBehaviour: !!options.mouseBehaviour || "features", // can be "everywhere", "features", or "none".
      clickSources: options.clickSources || [], // when mouseBehavior is "features", this is the list of source names to use when querying in click events
      mousemoveSources: options.mousemoveSources || [], // same as above, but for mousemove
    };
  }
}

var MAX_TILE_POOL_SIZE = 30;

MapboxGoogleOverlay.prototype._createTile = function() {
  let canv = document.createElement("canvas");
  canv.width = TILE_SIZE;
  canv.height = TILE_SIZE;
  canv.style.imageRendering = "pixelated";
  return canv;
};

MapboxGoogleOverlay.prototype.queryRenderedFeatures = function(opts) {
  // opts = {lat, lng, zoom}
  return this.mapboxRenderer.queryRenderedFeatures({
    lat: opts.lat,
    lng: opts.lng,
    source: opts.source,
    renderedZoom: opts.zoom,
  });
};

MapboxGoogleOverlay.prototype.setMouseOptions = function(opts) {
  // see constructor for details
  Object.assign(this._thawed, opts);
};


MapboxGoogleOverlay.prototype._getTilesSpec = function(coord, zoom, source) {
return [{
    source: source,
    z: zoom,
    x: coord.x,
    y: coord.y,
    left: 0,
    top: 0,
    size: TILE_SIZE,
}];
};

MapboxGoogleOverlay.prototype._renderTile = function(el) {
  !this._renderInfo.startTime && (this._renderInfo.startTime = Date.now());
  this._renderInfo.tilesPending++;

  let state = this._visibleTiles.get(el);
  this.mapboxRenderer.filterForZoom(state.zoom);

  let tilesSpec = this.mapboxRenderer
    .getVisibleSources(state.zoom)
    .reduce((a, s) => a.concat(this._getTilesSpec(state.coord, state.zoom, s)), []);
  state.ctx.globalCompositeOperation = "copy";
  state.renderRef = this.mapboxRenderer.renderTiles(
    state.ctx,
    { srcLeft: 0, srcTop: 0, width: TILE_SIZE, height: TILE_SIZE, destLeft: 0, destTop: 0 },
    tilesSpec,
    err => {
      this._renderInfo.errors += err && err !== "canceled" ? 1 : 0;
      this._renderInfo.tilesPending--;
      this.evented.fire("finishedRender", this._renderInfo);
      if (this._renderInfo.tilesPending === 0) {
        this._renderInfo.errors = 0;
        this._renderInfo.startTime = null;
      }
    },
  );
};

MapboxGoogleOverlay.prototype.getTile = function(coord, zoom) {
  if (zoom < this.minZoom || zoom > this.maxZoom) {
    return this._dummyTile; // for some reason the zoom limits are ignored so we have to do this
  }
  let canv = this._unusedTilesPool.pop() || this._createTile();
  canv.width = TILE_SIZE; // clear the canvas

  this._visibleTiles.set(canv, {
    canv: canv,
    ctx: canv.getContext("2d"),
    coord: coord,
    zoom: zoom,
    renderRef: null,
  });
  this._renderTile(canv);
  return canv;
};

MapboxGoogleOverlay.prototype.reRenderAll = function() {
  this._visibleTiles.forEach((state, el) => {
    this.mapboxRenderer.releaseRender(state.renderRef);
    this._renderTile(el);
  });
};

/* the next four functions wrap similarly named methods in mapboxRenderer
  and like those methods, they can either be executed immediately or,
  by default, they will return a function which can be used to trigger
  execution at a later point. This enables debouncing of changes. */
MapboxGoogleOverlay.prototype.setPaintProperty = function(layer, prop, val, exec = true) {
  let result = this.mapboxRenderer.setPaintProperty(layer, prop, val, exec);
  return exec
    ? result.then(isLatest => isLatest && this.reRenderAll())
    : () => result().then(isLatest => isLatest && this.reRenderAll());
};

MapboxGoogleOverlay.prototype.setFilter = function(layer, filter, exec = true) {
  let result = this.mapboxRenderer.setFilter(layer, filter, exec);
  return exec
    ? result.then(isLatest => isLatest && this.reRenderAll())
    : () => result().then(isLatest => isLatest && this.reRenderAll());
};

MapboxGoogleOverlay.prototype.setLayers = function(visibleLayers, exec = true) {
  let result = this.mapboxRenderer.setLayers(visibleLayers, exec);
  return exec
    ? result.then(isLatest => isLatest && this.reRenderAll())
    : () => result().then(isLatest => isLatest && this.reRenderAll());
};

MapboxGoogleOverlay.prototype.setLayerVisibility = function(layer, isVisible, exec = true) {
  let result = this.mapboxRenderer.setLayerVisibility(layer, isVisible, exec);
  return exec
    ? result.then(isLatest => isLatest && this.reRenderAll())
    : () => result().then(isLatest => isLatest && this.reRenderAll());
};

// ==================

MapboxGoogleOverlay.prototype.getLayerOriginalFilter = function(layer) {
  return this.mapboxRenderer.getLayerOriginalFilter(layer);
};

MapboxGoogleOverlay.prototype.getLayerOriginalPaint = function(layer) {
  return this.mapboxRenderer.getLayerOriginalPaint(layer);
};

MapboxGoogleOverlay.prototype.releaseTile = function(el) {
  if (el === this._dummyTile) {
    return;
  }
  var state = this._visibleTiles.get(el);
  this.mapboxRenderer.releaseRender(state.renderRef);
  this._visibleTiles.delete(el);
  if (this._unusedTilesPool.length < MAX_TILE_POOL_SIZE) {
    this._unusedTilesPool.push(el);
  }
};

MapboxGoogleOverlay.prototype._mouseEvent = function(kind, mouseEvent) {
  let overFeature = false;

  if (this._thawed.mouseBehaviour === "none") {
    return; // don't even try controlling the cursor
  } else if (this._thawed.mouseBehaviour === "everywhere") {
    this.evented.fire(kind, { mouseEvent, features: {}, source: null });
    overFeature = true;
  } else {
    (kind === "click" ? this._thawed.clickSources : this._thawed.mousemoveSources).forEach(source => {
      let features = this.queryRenderedFeatures({
        lat: mouseEvent.latLng.lat(),
        lng: mouseEvent.latLng.lng(),
        zoom: this._thawed._map.getZoom(),
        source,
      });
      if (Object.keys(features).length) {
        this.evented.fire(kind, { source, features, mouseEvent });
        overFeature = true;
      }
    });
  }

  if (kind === "mousemove") {
    this._thawed._map.setOptions({ draggableCursor: overFeature ? "pointer" : "" });
  }
};

MapboxGoogleOverlay.prototype.addToMap = function(map) {
  if (map.overlayMapTypes.indexOf(this) !== -1) {
    return;
  }
  map.overlayMapTypes.push(this);
  this._thawed._map = map;
  this._thawed._mousemove = google.maps.event.addListener(map, "mousemove", this._mouseEvent.bind(this, "mousemove"));
  this._thawed._click = google.maps.event.addListener(map, "click", this._mouseEvent.bind(this, "click"));
};

MapboxGoogleOverlay.prototype.removeFromMap = function(map) {
  console.assert(map && map === this._thawed._map);
  let idx = map.overlayMapTypes.indexOf(this);
  if (idx !== -1) {
    map.overlayMapTypes.removeAt(idx);
    google.maps.event.removeListener(this._thawed._mousemove);
    google.maps.event.removeListener(this._thawed._click);
  }
  this._thawed._map = null;
  this._visibleTiles.forEach((v, k) => this.releaseTile(k));
};

MapboxGoogleOverlay.prototype.getLayersVisible = function(zoom) {
  return this.mapboxRenderer.getLayersVisible(zoom);
};
