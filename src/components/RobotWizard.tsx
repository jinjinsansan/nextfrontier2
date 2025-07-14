import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import StepIndicator from './wizard/StepIndicator';
import Step1RootIndex from './wizard/Step1RootIndex';
import Step2TendencyParams from './wizard/Step2TendencyParams';
import Step3RaceParams from './wizard/Step3RaceParams';
import Step4LearningThought from './wizard/Step4LearningThought';
import Step5SaveRobot from './wizard/Step5SaveRobot';

export interface RobotData {
  rootIndex: number;
  tendencyParams: TendencyParam[];
  raceParams: RaceParam[];
  learningThought: string;
  robotName: string;
}

export interface TendencyParam {
  id: number;
  name: string;
  priority: number;
}

export interface RaceParam {
  category: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
  priority: number;
}

const RobotWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [robotData, setRobotData] = useState<RobotData>({
    rootIndex: 50,
    tendencyParams: [],
    raceParams: [],
    learningThought: '',
    robotName: ''
  });

  const steps = [
    { id: 1, title: '根幹指数入力' },
    { id: 2, title: '傾向パラメータ選択' },
    { id: 3, title: 'レース傾向パラメータ選択' },
    { id: 4, title: '学習的思考の選択' },
    { id: 5, title: 'ロボット保存' }
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateRobotData = (field: keyof RobotData, value: RobotData[keyof RobotData]) => {
    setRobotData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveRobot = () => {
    // localStorageに保存
    const savedRobots = JSON.parse(localStorage.getItem('aiRobots') || '[]');
    const newRobot = {
      id: Date.now(),
      ...robotData,
      createdAt: new Date().toISOString()
    };
    savedRobots.push(newRobot);
    localStorage.setItem('aiRobots', JSON.stringify(savedRobots));
    
    toast.success('AIロボットが正常に保存されました！');
    // AIロボット一覧画面に遷移
    window.location.href = '/my-robots';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1RootIndex
            rootIndex={robotData.rootIndex}
            onUpdate={(value) => updateRobotData('rootIndex', value)}
          />
        );
      case 2:
        return (
          <Step2TendencyParams
            tendencyParams={robotData.tendencyParams}
            onUpdate={(value) => updateRobotData('tendencyParams', value)}
          />
        );
      case 3:
        return (
          <Step3RaceParams
            raceParams={robotData.raceParams}
            onUpdate={(value) => updateRobotData('raceParams', value)}
          />
        );
      case 4:
        return (
          <Step4LearningThought
            learningThought={robotData.learningThought}
            onUpdate={(value) => updateRobotData('learningThought', value)}
          />
        );
      case 5:
        return (
          <Step5SaveRobot
            robotData={robotData}
            onUpdate={(value) => updateRobotData('robotName', value)}
            onSave={handleSaveRobot}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return robotData.rootIndex >= 0 && robotData.rootIndex <= 100;
      case 2:
        return robotData.tendencyParams.length === 4;
      case 3:
        return robotData.raceParams.length === 3;
      case 4:
        return robotData.learningThought !== '';
      case 5:
        return robotData.robotName.trim() !== '';
      default:
        return false;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 bg-gradient-to-r from-primary-600 to-accent-orange bg-clip-text text-transparent">
            AIロボット作成ウィザード
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            あなた専用のAIロボットを作成しましょう
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-orange mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* ステップインジケーター */}
          <motion.div variants={itemVariants} className="mb-8">
            <StepIndicator steps={steps} currentStep={currentStep} />
          </motion.div>

          {/* ステップコンテンツ */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>

              {/* ナビゲーションボタン */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={`btn-secondary ${
                    currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  戻る
                </button>

                <div className="text-sm text-gray-500">
                  ステップ {currentStep} / {steps.length}
                </div>

                {currentStep < 5 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`btn-primary ${
                      !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    次へ
                  </button>
                ) : (
                  <button
                    onClick={handleSaveRobot}
                    disabled={!canProceed()}
                    className={`btn-primary ${
                      !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    ロボットを保存
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RobotWizard; 