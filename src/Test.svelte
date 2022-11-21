<script>
  import {link} from 'svelte-spa-router'
</script>

<a href="/draw" use:link>Test Link</a>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 14px;

    --lineWidth: 2px;
    --lineColor: #292826;
    --mainColor: rgb(65, 63, 68);
    color: rgb(234, 235, 236);
  }

  :global(.rangeValue) {
    text-align: right;
    width: 5.8ex;
    float: right;
    line-height: 30px;
  }

  :global(input[type=range]) {
    width: calc(100% - 6ex);
    margin: 10px 0;
    height: 12px;
    background-color: transparent;
    -webkit-appearance: none;
    cursor: pointer;
    outline: none;
  }
  :global(input[type=range]::-webkit-slider-runnable-track, input[type=range]::-moz-range-track) {
    background: #0000;
    border: 0.2px solid #0006;
    width: 100%;
    height: 6px;
    cursor: pointer;
  }

  :global(input[type=range]::-webkit-slider-thumb) {
    width: 2px;
    height: 12px;
    background: #FFFF;
    border: none;
    cursor: pointer;
    -webkit-appearance: none;
  }

  :global(input[type=range]::-moz-range-thumb) {
    width: 2px;
    height: 12px;
    background: #FFFF;
    border: none;
    cursor: pointer;
  }
</style>