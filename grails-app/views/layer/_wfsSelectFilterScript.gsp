<script>
    jQuery(document).ready(function() {

        var timer;

        var filterWfsLayer = function() {
            var filter = jQuery("#inputFilter").val();
            jQuery("#listofwfslayers option").each(function() {
                var match = jQuery(this).text().search(new RegExp(filter, 'i'));
                if (match >= 0) {
                    jQuery(this).show();
                }
                else {
                    jQuery(this).hide();
                }
            });
        }

        jQuery("#inputFilter").keyup(function() {
            clearTimeout(timer);
            timer = setTimeout(filterWfsLayer, 1000);
        });
    });
</script>