<?php

/**
 * BaseVNomadeTaxonsFlore
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 * 
 * @property integer $id_nom
 * @property integer $cd_ref
 * @property integer $cd_nom
 * @property string $nom_latin
 * @property string $nom_francais
 * @property integer $id_classe
 * @property boolean $patrimonial
 * @property string $message
 * @property BibNoms $BibNoms
 * @property CorUniteTaxonCflore $CorUniteTaxonCflore
 * @property TRelevesCflore $TRelevesCflore
 * 
 * @method integer             get()                    Returns the current record's "id_nom" value
 * @method integer             get()                    Returns the current record's "cd_ref" value
 * @method integer             get()                    Returns the current record's "cd_nom" value
 * @method string              get()                    Returns the current record's "nom_latin" value
 * @method string              get()                    Returns the current record's "nom_francais" value
 * @method integer             get()                    Returns the current record's "id_classe" value
 * @method boolean             get()                    Returns the current record's "patrimonial" value
 * @method string              get()                    Returns the current record's "message" value
 * @method BibNoms             get()                    Returns the current record's "BibNoms" value
 * @method CorUniteTaxonCflore get()                    Returns the current record's "CorUniteTaxonCflore" value
 * @method TRelevesCflore      get()                    Returns the current record's "TRelevesCflore" value
 * @method VNomadeTaxonsFlore  set()                    Sets the current record's "id_nom" value
 * @method VNomadeTaxonsFlore  set()                    Sets the current record's "cd_ref" value
 * @method VNomadeTaxonsFlore  set()                    Sets the current record's "cd_nom" value
 * @method VNomadeTaxonsFlore  set()                    Sets the current record's "nom_latin" value
 * @method VNomadeTaxonsFlore  set()                    Sets the current record's "nom_francais" value
 * @method VNomadeTaxonsFlore  set()                    Sets the current record's "id_classe" value
 * @method VNomadeTaxonsFlore  set()                    Sets the current record's "patrimonial" value
 * @method VNomadeTaxonsFlore  set()                    Sets the current record's "message" value
 * @method VNomadeTaxonsFlore  set()                    Sets the current record's "BibNoms" value
 * @method VNomadeTaxonsFlore  set()                    Sets the current record's "CorUniteTaxonCflore" value
 * @method VNomadeTaxonsFlore  set()                    Sets the current record's "TRelevesCflore" value
 * 
 * @package    geonature
 * @subpackage model
 * @author     Gil Deluermoz
 * @version    SVN: $Id: Builder.php 7490 2010-03-29 19:53:27Z jwage $
 */
abstract class BaseVNomadeTaxonsFlore extends sfDoctrineRecord
{
    public function setTableDefinition()
    {
        $this->setTableName('contactflore.v_nomade_taxons_flore');
        $this->hasColumn('id_nom', 'integer', 8, array(
             'type' => 'integer',
             'primary' => true,
             'length' => 8,
             ));
        $this->hasColumn('cd_ref', 'integer', 8, array(
             'type' => 'integer',
             'length' => 8,
             ));
        $this->hasColumn('cd_nom', 'integer', 8, array(
             'type' => 'integer',
             'length' => 8,
             ));
        $this->hasColumn('nom_latin', 'string', 100, array(
             'type' => 'string',
             'length' => 100,
             ));
        $this->hasColumn('nom_francais', 'string', 50, array(
             'type' => 'string',
             'length' => 50,
             ));
        $this->hasColumn('id_classe', 'integer', 8, array(
             'type' => 'integer',
             'length' => 8,
             ));
        $this->hasColumn('patrimonial', 'boolean', 1, array(
             'type' => 'boolean',
             'length' => 1,
             ));
        $this->hasColumn('message', 'string', 255, array(
             'type' => 'string',
             'length' => 255,
             ));
    }

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('BibNoms', array(
             'local' => 'id_nom',
             'foreign' => 'id_nom'));

        $this->hasOne('CorUniteTaxonCflore', array(
             'local' => 'id_nom',
             'foreign' => 'id_nom'));

        $this->hasOne('TRelevesCflore', array(
             'local' => 'id_nom',
             'foreign' => 'id_nom'));
    }
}