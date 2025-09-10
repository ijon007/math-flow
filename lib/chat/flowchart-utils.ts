import { StudyGuideStep } from './tools';

export interface FlowChartNode {
  id: string;
  label: string;
  type: string;
  position: { x: number; y: number };
}

export interface FlowChartEdge {
  source: string;
  target: string;
  type: string;
}

export interface GeneratedFlowChart {
  nodes: FlowChartNode[];
  edges: FlowChartEdge[];
}

export function generateFlowChartFromLearningPath(
  learningPath: StudyGuideStep[],
  title: string
): GeneratedFlowChart {
  const nodes: FlowChartNode[] = [];
  const edges: FlowChartEdge[] = [];

  // Calculate layout dimensions
  const nodeHeight = 50;
  const horizontalSpacing = 300; // Increased for wider cards
  const verticalSpacing = 120; // Increased for taller cards
  const startX = 150;
  const startY = 100;

  // Group steps by type for better layout
  const conceptSteps = learningPath.filter(step => step.type === 'concept');
  const exampleSteps = learningPath.filter(step => step.type === 'example');
  const practiceSteps = learningPath.filter(step => step.type === 'practice');
  const visualizationSteps = learningPath.filter(step => step.type === 'visualization');

  let currentX = startX;
  let currentY = startY;
  let nodeIndex = 0;

  // Create nodes for each step
  learningPath.forEach((step, index) => {
    // Calculate position based on step type and index
    let x = currentX;
    let y = currentY;

    // For a cleaner layout, arrange nodes in a single column with proper spacing
    x = startX;
    y = startY + (index * verticalSpacing);

    // If we have many steps, arrange in multiple columns
    if (learningPath.length > 6) {
      const stepsPerColumn = Math.ceil(learningPath.length / 3);
      const column = Math.floor(index / stepsPerColumn);
      const row = index % stepsPerColumn;
      x = startX + (column * horizontalSpacing);
      y = startY + (row * verticalSpacing);
    }

    nodes.push({
      id: step.id,
      label: step.title, // No truncation - cards will adapt to text width
      type: step.type,
      position: { x, y }
    });

    // Create edges to next step
    if (index < learningPath.length - 1) {
      edges.push({
        source: step.id,
        target: learningPath[index + 1].id,
        type: 'sequential'
      });
    }

    // Create edges based on prerequisites
    step.prerequisites.forEach(prereqId => {
      const prereqStep = learningPath.find(s => s.id === prereqId);
      if (prereqStep) {
        edges.push({
          source: prereqId,
          target: step.id,
          type: 'prerequisite'
        });
      }
    });
  });

  return { nodes, edges };
}

export function generateFlowChartFromStudyGuide(studyGuide: {
  title: string;
  learningPath: StudyGuideStep[];
}): GeneratedFlowChart {
  return generateFlowChartFromLearningPath(studyGuide.learningPath, studyGuide.title);
}
