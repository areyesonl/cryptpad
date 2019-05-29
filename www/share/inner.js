define([
    'jquery',
    '/bower_components/nthen/index.js',
    '/common/sframe-common.js',
    '/common/common-ui-elements.js',
    '/common/common-interface.js',

    'css!/bower_components/bootstrap/dist/css/bootstrap.min.css',
    'css!/bower_components/components-font-awesome/css/font-awesome.min.css',
    'less!/share/app-share.less',
], function (
    $,
    nThen,
    SFCommon,
    UIElements,
    UI)
{
    var APP = window.APP = {};

    var andThen = function (common) {
        var metadataMgr = common.getMetadataMgr();
        var sframeChan = common.getSframeChannel();

        var hideShareDialog = function () {
            sframeChan.event('EV_SHARE_CLOSE');
        };
        /*
        var onShareAction = function (data) {
            hideShareDialog();
            sframeChan.event("EV_SHARE_ACTION", {
                // XXX data
            });
        };
        */

        var createShareDialog = function (data) {
            var priv = metadataMgr.getPrivateData();
            var hashes = priv.hashes;
            var origin = priv.origin;
            var pathname = priv.pathname;
            var f = (data && data.file) ? UIElements.createFileShareModal
                                          : UIElements.createShareModal;
            var modal = f({
                origin: origin,
                pathname: pathname,
                hashes: hashes,
                common: common,
                onClose: function () {
                    hideShareDialog();
                },
                fileData: {
                    hash: hashes.fileHash,
                    password: priv.password
                }
            });
            UI.openCustomModal(UI.dialog.tabs(modal));
        };
        sframeChan.on('EV_SHARE_REFRESH', function (data) {
            createShareDialog(data);
        });

        //UI.removeLoadingScreen();
    };

    var main = function () {
        var common;

        nThen(function (waitFor) {
            $(waitFor(function () {
                UI.removeLoadingScreen();
                //UI.addLoadingScreen({hideTips: true, hideLogo: true});
            }));
            SFCommon.create(waitFor(function (c) { APP.common = common = c; }));
        }).nThen(function (/*waitFor*/) {
            var metadataMgr = common.getMetadataMgr();
            if (metadataMgr.getMetadataLazy() !== 'uninitialized') {
                andThen(common);
                return;
            }
            metadataMgr.onChange(function () {
                andThen(common);
            });
        });
    };
    main();
});
