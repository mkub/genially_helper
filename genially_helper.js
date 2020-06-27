
// Identifies DOM object with which the "label" has been grouped. (Genially specific)
function find_by_label(label)
{
    let elem = document.getElementById(label);
    let parent = elem;
    let className = "";
    do {
        elem = parent;
        parent = elem.parentNode;
        className = elem.className;
    } while (parent != null && className != 'drag-active');
    return elem;
}


// Returns the bounding box coordinates
function get_box(obj){
    let dx = parseInt(obj.getAttribute('data-x'));
    if (isNaN(dx)) {
        dx = 0;
    }
    let left = parseInt(obj.offsetLeft) + dx;
    let right = left + parseInt(obj.offsetWidth);

    let dy = parseInt(obj.getAttribute('data-y'));
    if (isNaN(dy)) {
        dy = 0;
    }
    let top = parseInt(obj.offsetTop) + dy;
    let bottom = top + parseInt(obj.offsetHeight);

    let result = {left:left, right:right, top:top, bottom:bottom};
    return result;
}


// Two segments "overlap" when the middle point of each segment is inside the other segment.
function overlap1D(x1, x2, y1, y2){
    let mid1 = (x1 + x2) / 2;
    let mid2 = (y1 + y2) / 2;
    return (x1 <= mid2 && mid2 <= x2) || (y1 <= mid1 && mid1 <= y2);
}


// Condition: two labeled objects overlap
function overlap(label1, label2){
    let obj1 = find_by_label(label1);
    let obj2 = find_by_label(label2);

    function check(){
        if (obj1 != null && obj2 != null){
            let box1 = get_box(obj1);
            let box2 = get_box(obj2);
            if (box1 == null || box2 == null) {
                throw Error(label1 + " and/or " + label2 + " are no longer there!")
            }
            let result = overlap1D(box1.left, box1.right, box2.left, box2.right) && overlap1D(box1.top, box1.bottom, box2.top, box2.bottom);
            return result;
        } else {
            throw Error(label1 + " and/or " + label2 + " are not there");
        }
    }

    return check;
}


// Boolean && on conditions
function and(cond1, cond2){
    function check(){
        return cond1() && cond2();
    }

    return check;
}


// Boolean || on conditions
function or(cond1, cond2){
    function check(){
        return cond1() || cond2();
    }

    return check;
}


// Boolean ! on conditions
function not(cond){
    function check(){
        return !cond();
    }

    return check;
}


// Action: hide labeled object
function hide(label){
    let obj = find_by_label(label);

    function action(){
        if (obj != null && obj.style != null){
            obj.style.visibility = "hidden";
        } else {
            throw Error(label + " has disappeared!");
        }
    }

    return action;
}


// Action: show labeled object
function show(label){
    let obj = find_by_label(label);

    function action(){
        if (obj != null && obj.style != null){
            obj.style.visibility = "visible";
        } else {
            throw Error(label + " has disappeared!");
        }
    }

    return action;
}


// Action: play sound
function play_sound(url){
    let sound = new Audio(url);

    function action(){
        sound.play();
    }

    return action;
}


// Do action
function doit(action){
    action();
}


// Keep checking condition, until it becomes true, then perform action
function wait_until(cond, action){
    let TIME_TICK = 300;

    function check(){
        try {
            if (cond()){
                doit(action);
                clearInterval(checker);
            }
        } catch (err) {
            console.log(err.message);
            clearInterval(checker);
        }
    }

    let checker = setInterval(check, TIME_TICK);
    check();
}


// Keep checking condition, whenever it becomes true, perform action
function when(cond, action){
    let TIME_TICK = 300;
    let prev = false;

    function check(){
        try {
            let value = cond();
            if (!prev && value){
                doit(action);
            }
            prev = value;
        } catch (err) {
            console.log(err.message);
            clearInterval(checker);
        }
    }

    let checker = setInterval(check, TIME_TICK);
    check();
}
