export interface District {
  id: string;
  name: string;
}

export interface Division {
  id: string;
  name: string;
  districts: District[];
}

export interface Story {
 _id: string;
  title: string;
  content: string;
  district: string;
}
