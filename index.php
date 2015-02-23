<!doctype html>
<html class="no-js" lang="en">
  <head>
    <meta charset="utf-8" />

    <link href='http://fonts.googleapis.com/css?family=Raleway:100,400,800' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Roboto+Slab:700,400,100' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Warriors 3D projection</title>

    <link rel="stylesheet" href="fonts/foundation-icons.css" />
    <link rel="stylesheet" href="css/screen.css?2" />

    <script src="js/vendor/modernizr.js"></script>
    <script src="http://code.jquery.com/jquery-1.10.2.js"></script>

    
<!--[if IE]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->

  </head>

  <body id = "game">

    <section id = "stage1">

      <p>For the best experience save this page to your home screen</p>

      <button id="start_game" class = "btn">Start Game</button>

    </section>

    <section id = "bg1" class = "bg"></section>
    <section id = "bg2" class = "bg"></section>
    <section id = "bg2" class = "bg"></section>

    <section id = "game_container"></section>

    <section id = "game_skin">

      <header>

        <span class= "level-score left score_board"><i class="fi-target"></i> <span id= "score-fraction">0/0</span> <span id= "score-percent">0</span>%</span>
        <span class= "total score_board">SCORE: <span id = "total-score"></span></span>
        <span class= "time right score_board"><i class="fi-clock"></i> <span id= "time-secs">00</span></span>

      </header>

      <footer><span class= "wind right info_board">WIND <span id = "wind-strength"><i class="fi-arrow-left"></i><i class="fi-arrow-left"></i></span></span></footer>

    </section>

    <section id = "result_container"></section>

    <div id="action_layer"></div>

    <div id = "endLevel"></div>

    <!--  JAVASCRIPT -->
    <script src="http://hammerjs.github.io/dist/hammer.js"></script>
    <script src="js/custom.js?2"></script>
    <script src="js/flickKick.js?1"></script>
    <!-- -->

  </body>
</html>
