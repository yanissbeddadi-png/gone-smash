/** Quartiers présentés dans la section Lyon (coordonnées dans le repère SVG de la carte stylisée) */
export const districts = [
  { id: 'presquile', name: 'Presqu’île', x: 268, y: 330, text: 'Entre Rhône et Saône, le cœur battant. Notre adresse de démonstration s’y trouve.', burger: 'Le Presqu’île' },
  { id: 'croix-rousse', name: 'Croix-Rousse', x: 272, y: 190, text: 'La colline qui travaille, l’héritage des canuts et des pentes qui donnent faim.', burger: 'Le Canut' },
  { id: 'vieux-lyon', name: 'Vieux Lyon', x: 140, y: 318, text: 'Traboules, pavés et façades Renaissance. Un burger réconfortant, à son image.', burger: 'Le Vieux Lyon' },
  { id: 'part-dieu', name: 'Part-Dieu', x: 438, y: 290, text: 'La pause déjeuner des bureaux, la gare, le rythme de la ville qui avance.', burger: 'Le Gone' },
  { id: 'guillotiere', name: 'Guillotière', x: 392, y: 420, text: 'Le quartier le plus vivant de la rive gauche, mélange et street food.', burger: 'Le Double Trouble' },
  { id: 'confluence', name: 'Confluence', x: 236, y: 470, text: 'Là où les deux fleuves se rejoignent. Le nouveau Lyon, au bout de la Presqu’île.', burger: 'Le Veggie' },
] as const;
