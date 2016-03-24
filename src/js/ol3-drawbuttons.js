var ol3buttons = {

    initButtons: function (styleOptions)
    {
        return ol3buttons.container(styleOptions);
    },

    /**
     * Create container
     */
    container: function (styleOptions)
    {
        // Containers
        var elementDrawButtons = ol3buttons.drawButtons();
        var divDraw = document.createElement('div');
        divDraw.className = 'div-draw ' + this.olGroupClassName;

        elementDrawButtons.forEach(function(button) {
            //button.removeEventListener("dblclick", handleButtonsClick);
            if(options.draw[button.draw] == true) {
                divDraw.appendChild(button);
            }
        });

        var elementDrawControls = ol3buttons.drawControls();
        var divControls = document.createElement('div');
        divControls.className = 'div-controls ' + this.olGroupClassName;
        elementDrawControls.forEach(function(button) {
            //button.removeEventListener("dblclick", handleControlsClick);
            divControls.appendChild(button);
        });

        // Container
        var elementContainer = document.createElement('div');
        elementContainer.className = this.drawClassName;
        elementContainer.appendChild(divDraw);
        elementContainer.appendChild(divControls);

        return elementContainer;
    },

    /**
     * buttons for drawing
     */
    drawButtons: function()
    {
        var elementDrawButtons = new ol.Collection();

        // Marker
        var buttonPoint = this.buttonPoint = document.createElement('button');
        buttonPoint.setAttribute('title', 'Draw point');
        buttonPoint.id = buttonPoint.draw = 'Point';
        buttonPoint.type_control = 'draw';
        //buttonPoint.addEventListener('click', handleButtonsClick, false);
        elementDrawButtons.push(buttonPoint);

        // Line
        var buttonLine = this.buttonLine = document.createElement('button');
        buttonLine.setAttribute('title', 'Draw line');
        buttonLine.id = buttonLine.draw = 'LineString';
        buttonLine.type_control = 'draw';
        //buttonLine.addEventListener('click', handleButtonsClick, false);
        elementDrawButtons.push(buttonLine);

        // Square
        var buttonSquare = this.buttonCircle = document.createElement('button');
        buttonSquare.setAttribute('title', 'Draw square');
        buttonSquare.id = buttonSquare.draw = 'Square';
        buttonSquare.type_control = 'draw';
        //buttonSquare.addEventListener('click', handleButtonsClick, false);
        elementDrawButtons.push(buttonSquare);

        // Circle
        var buttonCircle = this.buttonCircle = document.createElement('button');
        buttonCircle.setAttribute('title', 'Draw circle');
        buttonCircle.id = buttonCircle.draw = 'Circle';
        buttonCircle.type_control = 'draw';
        //buttonCircle.addEventListener('click', handleButtonsClick, false);
        elementDrawButtons.push(buttonCircle);

        // Polygone
        var buttonPolygone = this.buttonPolygone = document.createElement('button');
        buttonPolygone.setAttribute('title', 'Draw polygone');
        buttonPolygone.id = buttonPolygone.draw = 'Polygon';
        buttonPolygone.type_control = 'draw';
        //buttonPolygone.addEventListener('click', handleButtonsClick, false);
        elementDrawButtons.push(buttonPolygone);

        // Record add items
        var buttonDrawEnd = this.buttonDrawEnd = document.createElement('button');
        buttonDrawEnd.setAttribute('title', 'Ending draw mode');
        buttonDrawEnd.id = buttonDrawEnd.draw = 'Ending';
        buttonDrawEnd.type_control = 'ending';
        //buttonDrawEnd.addEventListener('click', handleGroupEnd, false);
        //buttonDrawEnd.removeEventListener('dblclick', handleGroupEnd);
        elementDrawButtons.push(buttonDrawEnd);

        return elementDrawButtons;
    },

    /**
     * Control buttons
     */
    drawControls: function()
    {
        var elementDrawControls = new ol.Collection();

        var buttonEdit = this.buttonEdit = document.createElement('button');
        buttonEdit.setAttribute('title', 'Edit feature');
        buttonEdit.id = 'Edit';
        buttonEdit.type_control = 'edit';
        //buttonEdit.addEventListener('click', handleControlsClick, false);
        elementDrawControls.push(buttonEdit);

        // Delete
        var buttonDel = this.buttonEdit = document.createElement('button');
        buttonDel.setAttribute('title', 'Delete feature');
        buttonDel.id = 'Delete';
        buttonDel.type_control = 'delete';
        //buttonDel.addEventListener('click', handleControlsClick, false);
        elementDrawControls.push(buttonDel);

        var buttonControlEnd = this.buttonControlEnd = document.createElement('button');
        buttonControlEnd.setAttribute('title', 'Ending control mode');
        buttonControlEnd.id = 'Ending';
        buttonControlEnd.type_control = 'ending';
        //buttonControlEnd.addEventListener('click', handleGroupEnd, false);
        //buttonControlEnd.removeEventListener('dblclick', handleGroupEnd);
        elementDrawControls.push(buttonControlEnd);

        return elementDrawControls;
    }
}