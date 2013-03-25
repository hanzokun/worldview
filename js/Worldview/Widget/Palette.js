/*
 * NASA Worldview
 * 
 * This code was originally developed at NASA/Goddard Space Flight Center for
 * the Earth Science Data and Information System (ESDIS) project. 
 *
 * Copyright (C) 2013 United States Government as represented by the 
 * Administrator of the National Aeronautics and Space Administration.
 * All Rights Reserved.
 */

Worldview.namespace("Widget");

Worldview.Widget.Palette = function(containerId, config) {
    
    var self = {};
    var log = Logging.getLogger("Worldview.paletteWidget");
    var value = "";
    
    self.config = config;
    self.active = {};
            
    var init = function() {
        //Logging.debug("Worldview.paletteWidget");        
        log.debug("paletteWidget.init");
        if ( REGISTRY ) {
            REGISTRY.register(containerId, self);
        } else {
            throw new Error("Cannot register paletteWidget, REGISTRY " + 
                    "not found");
        }
        REGISTRY.markComponentReady(containerId);        
    };
    
    self.getPalette = function(product) {
        var name = self.active[product];
        if ( !name ) {
            name = config.products[product].rendered;
        }
        if ( !name ) {
            return null;
        }
        return config.palettes[name];    
    }
    
    self.setValue = function(v) {
        if ( v === undefined ) {
            return;
        }
        self.active = {};
        var parts = v.split("~");
        $.each(parts, function(index, part) {
            var segments = v.split(",");
            activePalettes[segments[0]] = segments[1];    
        });
        REGISTRY.fire(self);
    };
    
    self.getValue = function() {
        try {
            var parts = [];
            $.each(self.active, function(product, palette) {
                if ( palette ) {
                    parts.push(product + "," + palette);
                }
            });
            var qs = "";
            if ( parts.length > 0 ) {
                qs = containerId + "=" + parts.join("~");
            }
            return qs;
        } catch ( error ) {
            Worldview.error("Unable to update", error);
        }
    };
    
    self.displaySelector = function(product) { 
        var dialog = new YAHOO.widget.Panel("palette-selector-dialog", {
            width: "300px", 
            height: "500px",
            zIndex: 1020, 
            visible: false 
        });
        dialog.setHeader("Select palette");
        dialog.setBody("<div id='palette-selector'></div>");
        dialog.render(document.body);
        dialog.show();
        dialog.center();
        dialog.hideEvent.subscribe(function(i) {
            setTimeout(function() {dialog.destroy();}, 25);
        });       
        
        var palettes = [];
        var canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 14;
        
        var productConfig = self.config.products[product];            
        var renderedName = productConfig.rendered;
        
        var renderedPalette = Worldview.Palette.ColorBar({
            canvas: canvas,
            palette: config.palettes[renderedName],
            bins: productConfig.bins,
            stops: productConfig.stops
        });
        renderedPalette.name = "Default";
        renderedPalette.image = renderedPalette.toImage();
        palettes.push(renderedPalette);
        
        var activePalette = self.active[product];
        var selected = null;
                 
        $.each(self.config.palettes, function(name, p) {
            if ( p.source === "stock" ) {
                var cb = Worldview.Palette.ColorBar({
                    canvas: canvas, 
                    palette: p, 
                    bins: productConfig.bins,
                    stops: productConfig.stops
                });
                p.image = cb.toImage();
                palettes.push(p);
                if ( p.id === activePalette ) {
                    selected = palettes.length - 1;
                }
            }       
        });
    
        var paletteSelector = Worldview.Palette.PaletteSelector({
            selector: "#palette-selector",
            palettes: palettes
        });
        if ( selected !== null ) {
            paletteSelector.select(selected);
        }
                     
        paletteSelector.addSelectionListener(function(palette) {
            if ( palette.source === "rendered" ) {
                delete self.active[product];
            } else {
                self.active[product] = palette.id; 
            }
            REGISTRY.fire(self);
        });                                 
    };

    self.loadFromQuery = function(queryString) {
        log.debug("paletteWidget.loadFromQuery: " + queryString);
        var query = Worldview.queryStringToObject(queryString);
        if ( query.palettes && !Worldview.Support.allowCustomPalettes() ) {
            Worldview.Support.showUnsupportedMessage("custom palette");
        } else {
            self.setValue(query.palettes);
        }    
    };
    
    init();
    return self;
}
