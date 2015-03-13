/*global define, require, module, Phaser*/
/*jslint todo: true */
define(['underscore', "../scenes/ForestSwipeLeft"], function (_, forestSwipeLeft) {
    "use strict";
    function SceneLoader(spriteManagerPhaserApiInterface) //noinspection JSLint
    {
            this.idCounter = 0;
            this.spriteManagerPhaserApiInterface = spriteManagerPhaserApiInterface;
            this.sceneObjectsTable = [];
    }
    SceneLoader.prototype.loadScene = function loadScene(sceneType,text){
        this.cleanToDelete();
        var scene = this.loadSceneFromScenes(sceneType);
        //bind with texts
        //create image for texts
        _.each(scene.trees, function (entry) {
            this.bindTreeAndTweenToTable(entry);
        }, this); // bind to table
        this.spriteManagerPhaserApiInterface.tellAllActiveSpritesSoItCanUpdateIt(this.getAllActiveIds());
    };

    SceneLoader.prototype.getTreeFromId = function getTreeFromId(id){
        var treesWithId = _.filter(this.sceneObjectsTable,function(entry){
            return entry.id === id;
        });
        return treesWithId[0].tree;
    };
    SceneLoader.prototype.getAllActiveIds = function getAllActiveIds() {
        var array = [],
            i;
        for (i = 0; i < this.sceneObjectsTable.length; i++){
            array.push(this.sceneObjectsTable[i].id);
        }
        return array;
    };
    SceneLoader.prototype.bindTreeAndTweenToTable = function bindTreeAndTweenToTable(tree) {
        var tableentry;
        tableentry = this.createTableEntry(tree);
        this.deleteIfExistSameFinalPostionEntryAndCopyHisTextAndType(tree.initialPosition, tableentry);
        this.sceneObjectsTable.push(tableentry);
        return this.idCounter;
    };

    SceneLoader.prototype.createTableEntry = function createTableEntry(tree) {
        this.idCounter += 1;
        return {
            tree: tree,
            finalPosition: tree.finalPosition,
            id: this.idCounter
        };
    };

    SceneLoader.prototype.deleteIfExistSameFinalPostionEntryAndCopyHisTextAndType = function deleteIfExistSameFinalPostionEntryAndCopyHisTextAndType(initialPosition, tableentry) {
        var toSubstituteTreeEntry,
            toSubstituteIndex = this.findIndexOfTreeWithFinalPosition(initialPosition);
        toSubstituteTreeEntry = this.sceneObjectsTable[toSubstituteIndex];
        if (toSubstituteIndex >= 0) {
            this.sceneObjectsTable.splice(toSubstituteIndex, 1);
            this.copyValuesFromOldTreeToNewOne(toSubstituteTreeEntry, tableentry);
        }

    };

    SceneLoader.prototype.copyValuesFromOldTreeToNewOne = function copyValuesFromOldTreeToNewOne(oldTree, newTree) {
        newTree.tree.text = oldTree.tree.text;
        newTree.tree.type = oldTree.tree.type;
    }

    SceneLoader.prototype.findIndexOfTreeWithFinalPosition = function findIndexOfTreeWithFinalPosition(position) {
        var i;
        for (i = 0; i < this.sceneObjectsTable.length; i += 1) {
            if (this.sceneObjectsTable[i].finalPosition === position) {
                return i;
            }
        }
        return -1;
    };
    SceneLoader.prototype.getTreeWithFinalPosition = function getTreeWithFinalPosition(position) {
        var i = this.findIndexOfTreeWithFinalPosition(position);
        if (i >= 0) {
            return this.sceneObjectsTable[i];
        }
        return null;
    };



    SceneLoader.prototype.cleanToDelete = function cleanToDelete(){
        this.sceneObjectsTable = _.filter(this.sceneObjectsTable, function(entry){ return entry.finalPosition !== 'delete'});
    };

    SceneLoader.prototype.loadSceneFromScenes = function loadSceneFromScenes(sceneType){
        return forestSwipeLeft;
    };


    return SceneLoader;
});