/*
.product-menu {
  width: 100%;
  text-align: center;
  display: table;

  > li {
    display: inline-block;
    width: 31%;
    margin: 0 0 25px 2%;
    &:first-child {
      margin-left: 0;
    }
  }

  @media (max-width: $breakpoint-md-p) {
    > li {
      display: block;
      width: 100%;
      margin: 0 0 10px 0;
    }
  }
}

.product {
  border: 1px solid $border-color;
  background: $white none repeat 0 0;
  @include box-shadow();
  padding: 20px 15px;
  border-radius: 2px;

  .description {
    margin: 0 0 20px 0;
    height: 65px;
  }

  .prices {
    margin: 0 0 20px 0;
    position: relative;

    .toggler {
      display: none;
    }

    .cnt {
      @include transition( all, .6s, ease);
    }
  }

  .action {

  }

  @media (max-width: $breakpoint-md-p) {
    .description {
      height: auto;
    }

    .prices {
      .toggler {
        display: block;
      }
    }
  }
}
*/

/******************************************************************************
******************************************************************************/
try { CONFIG; } catch( error ){ CONFIG = {};   }

function convertTranslation() {
  $('[data-translate]').each( function(i,dom) {
      

  });
}

$( document ).ready(function() {
  convertTranslation(); 
});