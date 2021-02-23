--Sur les cd_sig diffusé par le mesuem, il y a parfois des leading zero (ex : 5kmL93E0740N6945 au lieu de 5kmL93E740N6945). En comparant les grilles 1, 5 et 10km, je ne vois pas trop la cohérance (ex : 1kmL93E742N6946 et 5kmL93E0740N6945 : pourquoi un leading zero dans le 5km et pas dans le 1km ?), et je ne trouve pas de méthodo claire. Le standard européen est plus explicite (pas de leading zero) sur la façon de générer les code de chaque maille  (https://www.eea.europa.eu/data-and-maps/data/eea-reference-grids-2). Les codes peuvent donc ne pas correspondre à ce qu'il y a dans le référentiel de l'INPN
--TODO : fonction avec une regex pour supprimer/ajouter les leading zero dans les cd_sig (pour compatibilité avec l'INPN) ?
--TODO : rendre les fonction plus génériques, pour qu'elles fonctionnent notamment avec EPSG:3035 et des cellules inférieures à 1km 



CREATE OR REPLACE FUNCTION ref_geo.cell_reference(_geom geometry, _cell_size integer DEFAULT 10000, _referentiel_epsg integer DEFAULT 2154)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
  --Returne le code de la cellule contenant la geométrie. La géometrie doit être un point.
  --Exemple : SELECT ref_geo.cell_reference(st_setsrid(st_makepoint(749648,6956485),2154), 10000)  --> 10kmL93E074N695
  BEGIN 
    RETURN (SELECT (_cell_size/1000 ) ||'km' ||
   		'L93' || 'E'|| 
   		trunc((st_x(_geom) + (st_x(_geom)/_cell_size - st_x(_geom)::numeric%_cell_size::numeric))/ pow(10,trunc(log(_cell_size))) )
   		||'N'|| 
   		trunc((st_y(_geom) + (st_y(_geom)/_cell_size - st_y(_geom)::numeric%_cell_size::numeric))/ pow(10,trunc(log(_cell_size))) )
    );
  END;
$function$
;



CREATE OR REPLACE FUNCTION ref_geo.cellref_to_polygon(_cellule_reference text, _referentiel_epsg integer DEFAULT 2154)
 RETURNS geometry
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
	DECLARE
 	 v TEXT[];
 	 multiplicator int;
  BEGIN
 	SELECT INTO v (REGEXP_MATCHES(_cellule_reference,'([0-9]+)kmL93E([0-9]+)N([0-9]+)'));
 	SELECT INTO multiplicator pow(10,trunc(log(v[1]::int*1000)));
 	RETURN (SELECT st_setsrid(
 			ST_Square(v[1]::int*1000,0,0, st_setsrid(st_makepoint(v[2]::int*multiplicator,v[3]::int*multiplicator),2154)),2154));
  END;
$function$
;

