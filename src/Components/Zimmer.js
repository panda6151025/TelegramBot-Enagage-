/* update: realise I should use const and let instead of var, will update sometime */
var scaling = "fit";
var width = 1024;
var height = 768;
var color = lighter;
var outerColor = grey;

var frame = new Frame(scaling, width, height, color, outerColor);

frame.on("ready", function () {
  zog("ready from ZIM Frame");

  var stage = frame.stage;
  var stageW = frame.width;
  var stageH = frame.height;

  new Label("RISE UP with ZIM - Drag around and adjust controls")
    .pos(40, 60)
    .alp(0.5);

  var physics = new Physics(0);

  const emit = new Emitter({
    obj: new Circle(15, [black, green, blue]),
    num: 1,
    gravity: -25 // this is the magic to create rising effect using a negative gravity number
  })
    //    .drag()   doesn't work, not sure why. use physics drag instead
    .centerReg()
    .addPhysics();

  new Label("Quantity").pos(530, 600).alp(0.5);

  var Qtyslider = new Slider({
    currentValue: 1,
    useTicks: true,
    tickStep: 1,
    min: 1,
    max: 9,
    useLabels: true //not working, not sure why
  })
    .center()
    .change(function () {
      emit.num = Qtyslider.currentValue;
    })
    .loc(450, 690);

  new Label("Rising Power").pos(95, 600).alp(0.5);

  var powerSlider = new Slider({
    currentValue: 10,
    useTicks: true,
    tickStep: 3,
    min: 10,
    max: -30,
    useLabels: true //not working, not sure why
  })
    .center()
    .change(function () {
      var negativeGravity = powerSlider.currentValue - 25;
      emit.gravity = negativeGravity;
    })
    .loc(55, 690);

  var toggle = new Toggle({
    backgroundColor: red,
    toggleBackgroundColor: green,
    corner: 20,
    indicatorColor: dark,
    margin: 20,
    label: "on",
    startToggled: true
  })
    .loc(820, 650)
    .tap((e) => {
      var toggleStatus = !e.target.toggled;
      emit.pauseEmitter(toggleStatus);
    });

  physics.drag();
});
