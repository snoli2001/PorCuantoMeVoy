import {GradeModel} from "./grade.model";

export class CourseModel {
  id: string;
  name: string;
  goal: number;
  average: number;
  grades: GradeModel[];
  currentPercentage: number;
  mission: number;
}
