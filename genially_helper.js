
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

function overlap1D(x1, x2, y1, y2){
	let mid1 = (x1 + x2) / 2;
	let mid2 = (y1 + y2) / 2;
	return (x1 <= mid2 && mid2 <= x2) || (y1 <= mid1 && mid1 <= y2);
}

function overlap(obj1, obj2){
	let box1 = get_box(obj1);
	let box2 = get_box(obj2);
	return overlap1D(box1.left, box1.right, box2.left, box2.right) && overlap1D(box1.top, box1.bottom, box2.top, box2.bottom);
}

function hide_on_overlap(label1, label2, hide){
	let obj1 = find_by_label(label1);
	let obj2 = find_by_label(label2);
	let tohide = find_by_label(hide);

	function check(){
		if (overlap(obj1, obj2)){
			tohide.style.visibility = "hidden";
			clearInterval(checker);
		}
	}
	
	let checker = setInterval(check, 300);
}

function show_on_overlap(label1, label2, hide){
	let obj1 = find_by_label(label1);
	let obj2 = find_by_label(label2);
	let tohide = find_by_label(hide);

	function check(){
		if (overlap(obj1, obj2)){
			tohide.style.visibility = "visible";
			clearInterval(checker);
		}
	}
	
	let checker = setInterval(check, 300);
}


